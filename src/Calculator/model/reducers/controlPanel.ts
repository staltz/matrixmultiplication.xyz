import xs, {Stream} from 'xstream';
import MatrixValues from '../../../utils/MatrixValues';
import {State, Reducer} from '../index';
import {
  Action,
  isStartMultiplyAction,
  isNextStepAction,
  isEndAction,
  isResetAction,
} from '../actions';
import {calculateNextMatrixC} from '../calculate';
import {lastCombStep} from '../queries';

export function startMultiplyReducer$(action$: Stream<Action>): Stream<Reducer> {
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

export function nextStepReducer$(action$: Stream<Action>): Stream<Reducer> {
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

export function fastForwardToEndReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isEndAction)
    .map(action => function fastForwardToEndReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
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
        return prevState;
      }
    });
}

export function resetReducer$(action$: Stream<Action>): Stream<Reducer> {
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
