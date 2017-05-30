import xs, {Stream} from 'xstream';
import {State, Reducer} from '../index';
import {lastCombStep} from '../queries';
import {calculateNextMatrixC} from '../calculate';

export function allowContinueReducer$(action$: Stream<null>): Stream<Reducer> {
  return action$
    .map(() => function allowContinueReducer(prevState: State): State {
      if (prevState.fastForwardToEnd && prevState.matrixC) {
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
        return {
          ...prevState,
          canInteract: true,
          fastForwardToEnd: false,
        };
      }
    });
}
