import xs, {Stream, MemoryStream} from 'xstream';
import * as Immutable from 'immutable';
import MatrixValues from '../utils/MatrixValues';
import {Measurements} from './measure';
import {
  Action,
  isResizeAction,
  isStartMultiplyAction,
  isAllowContinueAction,
  isNextStepAction,
  isResetAction,
  isEndAction,
  Direction,
} from './intent/index';
import {State as MatrixState} from '../Matrix/index';
import {lastCombStep} from './queries';

export interface State {
  step: number;
  canInteract: boolean;
  fastForwardToEnd: boolean;
  measurements: Measurements;
  matrixA: MatrixState;
  matrixB: MatrixState;
  matrixC: MatrixState | undefined;
}

export type MatrixID = 'A' | 'B';

export type Reducer = (oldState: State) => State;

let defaultState: State = {
  step: 0,
  canInteract: true,
  fastForwardToEnd: false,
  measurements: {
    matrixAHeight: 0,
    matrixBWidth: 0,
    matrixBHeight: 0,
    rowHeight: 0,
  },
  matrixA: {
    values: MatrixValues.from([[1, 2, 1], [0, 1, 0], [2, 3, 4]]),
    editable: true,
    id: 'A',
  },
  matrixB: {
    values: MatrixValues.from([[2, 5], [6, 7], [1, 8]]),
    editable: true,
    id: 'B',
  },
  matrixC: void 0,
};

const initReducer$ = xs.of(function initReducer(prevState: State) {
  if (!prevState) {
    return defaultState;
  } else {
    return prevState;
  }
});

function resizeReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isResizeAction)
    .map(action => function resizeReducer(prevState: State): State {
      return Immutable.Map({
        step: prevState.step,
        canInteract: prevState.canInteract,
        fastForwardToEnd: prevState.fastForwardToEnd,
        measurements: Immutable.Map(prevState.measurements),
        matrixA: Immutable.Map(prevState.matrixA),
        matrixB: Immutable.Map(prevState.matrixB),
        matrixC: prevState.matrixC,
      }).updateIn(['matrix' + action.payload.target, 'values'], oldVals => {
        if (action.payload.resizeParam.direction === 'row') {
          return oldVals.resize(
            oldVals.numberRows + action.payload.resizeParam.amount,
            oldVals.numberColumns
          )
        } else {
          return oldVals.resize(
            oldVals.numberRows,
            oldVals.numberColumns + action.payload.resizeParam.amount
          )
        }
      }).toJS();
    });
}

function startMultiplyReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isStartMultiplyAction)
    .map(action => function startMultiplyReducer(prevState: State): State {
      if (prevState.step === 0) {
        return {
          step: 1,
          canInteract: false,
          fastForwardToEnd: false,
          measurements: prevState.measurements,
          matrixA: {
            editable: false,
            values: prevState.matrixA.values,
            id: prevState.matrixA.id,
          },
          matrixB: {
            editable: false,
            values: prevState.matrixB.values,
            id: prevState.matrixB.id,
          },
          matrixC: {
            editable: false,
            values: MatrixValues.ofDimensions(
              prevState.matrixA.values.numberRows,
              prevState.matrixB.values.numberColumns
            ).setAll(null),
            id: 'C',
          }
        };
      } else {
        return prevState;
      }
    });
}

function calculateCellMatrixC(i: number,
                              j: number,
                              matrixA: MatrixValues,
                              matrixB: MatrixValues): number {
  const m = matrixA.numberColumns;
  let acc = 0;
  for (let k = 0; k < m; k++) {
    acc += matrixA.get(i, k) * matrixB.get(k, j);
  }
  return acc;
}

function calculateNextMatrixC(nextStep: number,
                              matrixA: MatrixValues,
                              matrixB: MatrixValues,
                              matrixC: MatrixValues): MatrixValues {
  let newMatrixC = matrixC;
  matrixC.rows.forEach((row, i) => {
    row.forEach((cellC, j) => {
      if (i + j === nextStep - 2) {
        const val = calculateCellMatrixC(i, j, matrixA, matrixB);
        newMatrixC = newMatrixC.set(i, j, val);
      }
    });
  });
  return newMatrixC;
}

function nextStepReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isNextStepAction)
    .map(action => function nextStepReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
        const nextStep = prevState.step + 1;
        return {
          step: nextStep,
          canInteract: false,
          fastForwardToEnd: prevState.fastForwardToEnd,
          measurements: prevState.measurements,
          matrixA: prevState.matrixA,
          matrixB: prevState.matrixB,
          matrixC: {
            editable: prevState.matrixC.editable,
            values: calculateNextMatrixC(
              nextStep,
              prevState.matrixA.values,
              prevState.matrixB.values,
              prevState.matrixC.values,
            ),
            id: prevState.matrixC.id,
          },
        };
      } else {
        return prevState;
      }
    });
}

function allowContinueReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isAllowContinueAction)
    .map(action => function allowContinueReducer(prevState: State): State {
      if (prevState.fastForwardToEnd && prevState.matrixC) {
        const nextStep = prevState.step + 1;
        return {
          step: nextStep,
          canInteract: false,
          fastForwardToEnd: nextStep <= lastCombStep(prevState),
          measurements: prevState.measurements,
          matrixA: prevState.matrixA,
          matrixB: prevState.matrixB,
          matrixC: {
            editable: prevState.matrixC.editable,
            values: calculateNextMatrixC(
              nextStep,
              prevState.matrixA.values,
              prevState.matrixB.values,
              prevState.matrixC.values,
            ),
            id: prevState.matrixC.id,
          },
        };
      } else {
        return {
          step: prevState.step,
          canInteract: true,
          fastForwardToEnd: false,
          measurements: prevState.measurements,
          matrixA: prevState.matrixA,
          matrixB: prevState.matrixB,
          matrixC: prevState.matrixC,
        };
      }
    });
}

function updateMeasurementsReducer$(measurements$: Stream<Measurements>): Stream<Reducer> {
  return measurements$
    .map(measurements => function (prevState: State): State {
      return {
        step: prevState.step,
        canInteract: prevState.canInteract,
        fastForwardToEnd: prevState.fastForwardToEnd,
        measurements,
        matrixA: prevState.matrixA,
        matrixB: prevState.matrixB,
        matrixC: prevState.matrixC,
      };
    });
}

function resetReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isResetAction)
    .map(action => function resetReducer(prevState: State): State {
      return {
        step: 0,
        canInteract: true,
        fastForwardToEnd: false,
        measurements: prevState.measurements,
        matrixA: {
          values: prevState.matrixA.values,
          editable: true,
          id: prevState.matrixA.id,
        },
        matrixB: {
          values: prevState.matrixB.values,
          editable: true,
          id: prevState.matrixB.id,
        },
        matrixC: void 0,
      };
    });
}

function fastForwardToEndReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isEndAction)
    .map(action => function fastForwardToEndReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
        const nextStep = prevState.step + 1;
        return {
          step: nextStep,
          canInteract: false,
          fastForwardToEnd: true,
          measurements: prevState.measurements,
          matrixA: prevState.matrixA,
          matrixB: prevState.matrixB,
          matrixC: {
            editable: prevState.matrixC.editable,
            values: calculateNextMatrixC(
              nextStep,
              prevState.matrixA.values,
              prevState.matrixB.values,
              prevState.matrixC.values,
            ),
            id: prevState.matrixC.id,
          },
        };
      } else {
        return prevState;
      }
    });
}

export default function model(action$: Stream<Action>,
                              measurements$: Stream<Measurements>): Stream<Reducer> {
  return xs.merge(
    initReducer$,
    resizeReducer$(action$),
    updateMeasurementsReducer$(measurements$),
    startMultiplyReducer$(action$),
    allowContinueReducer$(action$),
    nextStepReducer$(action$),
    resetReducer$(action$),
    fastForwardToEndReducer$(action$),
  );
}
