import xs, {Stream, MemoryStream} from 'xstream';
import * as Immutable from 'immutable';
import MatrixValues from '../utils/MatrixValues';
import {ResizeAction, Action} from './intent';
import {State as MatrixState} from '../Matrix/index';

export interface State {
  matrixA: MatrixState;
  matrixB: MatrixState;
  step: number;
}

export type MatrixID = 'A' | 'B';

export type Reducer = (oldState: State) => State;

let defaultState: State = {
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
  step: 0,
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
    .filter(a => a.type === 'RESIZE')
    .map(a => <ResizeAction>a.payload)
    .map(action => function resizeReducer(oldState: State): State {
      return Immutable.Map({
        matrixA: Immutable.Map(oldState.matrixA),
        matrixB: Immutable.Map(oldState.matrixB),
        step: oldState.step
      }).updateIn(['matrix' + action.target, 'values'], oldVals => {
        if (action.resizeParam.direction === 'row') {
          return oldVals.resize(
            oldVals.numberRows + action.resizeParam.amount,
            oldVals.numberColumns
          )
        } else {
          return oldVals.resize(
            oldVals.numberRows,
            oldVals.numberColumns + action.resizeParam.amount
          )
        }
      }).toJS();
    });
}

function startMultiplyReducer$(action$: Stream<Action>): Stream<Reducer> {
  return action$
    .filter(a => a.type === 'START_MULTIPLY')
    .map(action => function startMultiplyReducer(prevState: State): State {
      if (prevState.step === 0) {
        return {
          step: 1,
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
        };
      } else {
        return prevState;
      }
    });
}

export default function model(action$: Stream<Action>): Stream<Reducer> {
  return xs.merge(
    initReducer$,
    resizeReducer$(action$),
    startMultiplyReducer$(action$)
  );
}
