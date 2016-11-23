import xs, {Stream} from 'xstream';
import MatrixValues from '../../../utils/MatrixValues';
import {State, Reducer} from '../index';
import {Action, isResizeAction} from '../actions';

export function resizeReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(isResizeAction)
    .map(action => function resizeReducer(prevState: State): State {
      const targetMatrix = 'matrix' + action.payload.target;

      const nextState: State = {
        step: prevState.step,
        canInteract: prevState.canInteract,
        fastForwardToEnd: prevState.fastForwardToEnd,
        measurements: prevState.measurements,
        matrixA: prevState.matrixA,
        matrixB: prevState.matrixB,
        matrixC: prevState.matrixC,
      };

      const prevValues: MatrixValues = prevState[targetMatrix].values;

      if (action.payload.resizeParam.direction === 'row') {
        nextState[targetMatrix].values = prevValues.resize(
          prevValues.numberRows + action.payload.resizeParam.amount,
          prevValues.numberColumns
        );
      } else {
        nextState[targetMatrix].values = prevValues.resize(
          prevValues.numberRows,
          prevValues.numberColumns + action.payload.resizeParam.amount
        );
      }

      return nextState;
    });
}
