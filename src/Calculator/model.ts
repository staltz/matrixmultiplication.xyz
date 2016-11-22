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
  Direction,
} from './intent';
import {State as MatrixState} from '../Matrix/index';

export interface State {
  step: number;
  canInteract: boolean;
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
  measurements: {
    matrixAHeight: 0,
    matrixBWidth: 0,
    matrixBHeight: 0,
    rowHeight: 0,
  },
  matrixA: {
    values: MatrixValues.ofDimensions(4, 2),
    editable: true,
    id: 'A',
  },
  matrixB: {
    values: MatrixValues.ofDimensions(2, 3),
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

function nextStepReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isNextStepAction)
    .map(action => function nextStepReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract) {
        return {
          step: prevState.step + 1,
          canInteract: false,
          measurements: prevState.measurements,
          matrixA: prevState.matrixA,
          matrixB: prevState.matrixB,
          matrixC: prevState.matrixC,
        }
      } else {
        return prevState;
      }
    });
}

function allowContinueReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isAllowContinueAction)
    .map(action => function allowContinueReducer(prevState: State): State {
      return {
        step: prevState.step,
        canInteract: true,
        measurements: prevState.measurements,
        matrixA: prevState.matrixA,
        matrixB: prevState.matrixB,
        matrixC: prevState.matrixC,
      };
    });
}

function updateMeasurementsReducer$(measurements$: Stream<Measurements>): Stream<Reducer> {
  return measurements$
    .map(measurements => function (prevState: State): State {
      return {
        step: prevState.step,
        canInteract: prevState.canInteract,
        measurements,
        matrixA: prevState.matrixA,
        matrixB: prevState.matrixB,
        matrixC: prevState.matrixC,
      };
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
  );
}
