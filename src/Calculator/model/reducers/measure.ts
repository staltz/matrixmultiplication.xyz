import xs, {Stream} from 'xstream';
import {State, Reducer, Measurements} from '../index';

export function updateMeasurementsReducer$(measurements$: Stream<Measurements>): Stream<Reducer> {
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
