import xs, {Stream} from 'xstream';
import {State, Reducer} from '../index';
import {Action, isAllowContinueAction} from '../actions';
import {lastCombStep} from '../queries';
import {calculateNextMatrixC} from '../calculate';

export function allowContinueReducer$(action$: Stream<Action>): Stream<Reducer> {
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
