import xs, {Stream} from 'xstream';
import MatrixValues from '../../../utils/MatrixValues';
import {State, Reducer} from '../index';
import {ResizeAction} from '../actions';

export function resizeReducer$(action$: Stream<ResizeAction>): Stream<Reducer> {
  return action$
    .map(action => function resizeReducer(prevState: State): State {
      const targetMatrix = 'matrix' + action.target;

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

      if (action.resizeParam.direction === 'row') {
        nextState[targetMatrix].values = prevValues.resize(
          prevValues.numberRows + action.resizeParam.amount,
          prevValues.numberColumns
        );
      } else {
        nextState[targetMatrix].values = prevValues.resize(
          prevValues.numberRows,
          prevValues.numberColumns + action.resizeParam.amount
        );
      }

      return nextState;
    });
}
