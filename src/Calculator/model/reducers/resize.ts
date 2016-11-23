import xs, {Stream} from 'xstream';
import * as Immutable from 'immutable';
import {State, Reducer} from '../index';
import {Action, isResizeAction} from '../actions';

export function resizeReducer$(action$: Stream<Action>): Stream<Reducer> {
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
