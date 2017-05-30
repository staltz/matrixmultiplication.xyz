import xs, {Stream} from 'xstream';
import MatrixValues from '../../../utils/MatrixValues';
import {State, Reducer} from '../index';
import {calculateNextMatrixC} from '../calculate';
import {lastCombStep} from '../queries';

export function startMultiplyReducer$(action$: Stream<null>): Stream<Reducer> {
  return action$
    .map(() => function startMultiplyReducer(prevState: State): State {
      if (prevState.step === 0) {
        return {
          ...prevState,
          step: 1,
          canInteract: false,
          fastForwardToEnd: false,
          matrixA: {...prevState.matrixA, editable: false},
          matrixB: {...prevState.matrixB, editable: false},
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

export function nextStepReducer$(action$: Stream<null>): Stream<Reducer> {
  return action$
    .map(() => function nextStepReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
        const nextStep = prevState.step + 1;
        return {
          ...prevState,
          step: nextStep,
          canInteract: false,
          matrixC: {
            ...prevState.matrixC,
            values: calculateNextMatrixC(
              nextStep,
              prevState.matrixA.values,
              prevState.matrixB.values,
              prevState.matrixC.values,
            ),
          },
        };
      } else {
        return prevState;
      }
    });
}

export function fastForwardToEndReducer$(action$: Stream<null>): Stream<Reducer> {
  return action$
    .map(() => function fastForwardToEndReducer(prevState: State): State {
      if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
        const nextStep = prevState.step + 1;
        return {
          ...prevState,
          step: nextStep,
          canInteract: false,
          fastForwardToEnd: nextStep <= lastCombStep(prevState),
          matrixC: {
            ...prevState.matrixC,
            values: calculateNextMatrixC(
              nextStep,
              prevState.matrixA.values,
              prevState.matrixB.values,
              prevState.matrixC.values,
            ),
          },
        };
      } else {
        return prevState;
      }
    });
}

export function resetReducer$(action$: Stream<null>): Stream<Reducer> {
  return action$
    .map(() => function resetReducer(prevState: State): State {
      return {
        ...prevState,
        step: 0,
        canInteract: true,
        fastForwardToEnd: false,
        matrixA: {...prevState.matrixA, editable: true},
        matrixB: {...prevState.matrixB, editable: true},
        matrixC: void 0,
      };
    });
}
