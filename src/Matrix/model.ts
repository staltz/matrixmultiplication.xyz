import xs, {Stream, MemoryStream} from 'xstream';
import * as Immutable from 'immutable';
import {Action} from './intent';
import MatrixValues from '../MatrixValues';

export interface State {
  values: MatrixValues;
  editable: boolean;
}

export type Reducer = (state: State) => State;

export default function model(action$: Stream<Action>): Stream<Reducer> {
  const inputReducer$ = action$.map(a =>
    function inputReducer(old: State): State {
      return Immutable.Map<string, any>(old).updateIn(['values'], oldVals =>
        oldVals.set(a.row, a.col, a.val)
      ).toJS();
    }
  );

  const initReducer$ = xs.of(function initReducer(old: State): State {
    const defaultState = {
      values: MatrixValues.ofDimensions(1, 1),
      editable: true,
    };
    return old ? old : defaultState;
  });

  return xs.merge(inputReducer$, initReducer$);
}