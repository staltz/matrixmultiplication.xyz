import xs, {Stream} from 'xstream';
import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import isolate from '@cycle/isolate';
import MatrixValues from '../MatrixValues';
import Matrix from '../Matrix/index';
import intent from './intent';
import model, {State, Reducer} from './model';
import view from './view';
import {StateSource} from '../utils/onionify';

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}

export type MatrixID = 'A' | 'B';

export default function Calculator(sources: Sources): Sinks {
  let matrixASinks = isolate(Matrix, 'matrixA')(<any> sources);
  let matrixBSinks = isolate(Matrix, 'matrixB')(<any> sources);

  let action$ = intent(sources.DOM);
  let reducer$ = xs.merge(model(action$), matrixASinks.onion, matrixBSinks.onion);
  let vdom$ = view(sources.onion.state$, matrixASinks.DOM, matrixBSinks.DOM);

  let sinks = {
    DOM: vdom$,
    onion: reducer$,
  };
  return sinks;
}
