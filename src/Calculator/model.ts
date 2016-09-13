import xs, {Stream, MemoryStream} from 'xstream';
import * as Immutable from 'immutable';
import MatrixValues from '../MatrixValues';
import {MatrixID} from './index';

export interface Action {
  type: 'RESIZE' | 'START_MULTIPLY';
  payload: any;
}

export interface ResizeAction {
  target: MatrixID;
  resizeParam: {
    direction: 'row' | 'column';
    amount: number;
  };
}

export interface MatrixState {
  values: MatrixValues;
  editable: boolean;
}

export interface State {
  matrixA: MatrixState;
  matrixB: MatrixState;
  step: number;
}

export type Reducer = (oldState: State) => State;

let defaultState: State = {
  matrixA: {
    values: MatrixValues.ofDimensions(4, 2),
    editable: true,
  },
  matrixB: {
    values: MatrixValues.ofDimensions(2, 3),
    editable: true,
  },
  step: 0,
};

const initReducer$ = xs.of(function initReducer(oldState: State) {
  if (oldState.matrixA && oldState.matrixB && typeof oldState.step === 'number') {
    return oldState;
  } else {
    return defaultState;
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
    .map(action => function startMultiplyReducer(oldState: State): State {
      if (oldState.step === 0) {
        return {
          step: 1,
          matrixA: {
            editable: false,
            values: oldState.matrixA.values,
          },
          matrixB: {
            editable: false,
            values: oldState.matrixB.values,
          },
        };
      } else {
        return oldState;
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
