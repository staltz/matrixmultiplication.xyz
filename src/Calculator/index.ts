import xs, {Stream} from 'xstream';
import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import isolate from '@cycle/isolate';
import MatrixValues from '../utils/MatrixValues';
import Matrix from '../Matrix/index';
import intent from './intent';
import measure from './measure';
import model, {State, Reducer} from './model';
import view from './view';
import {StateSource} from 'cycle-onionify';

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}


export default function Calculator(sources: Sources): Sinks {
  const matrixASinks = isolate(Matrix, 'matrixA')(<any> sources);
  const matrixBSinks = isolate(Matrix, 'matrixB')(<any> sources);
  const matrixCSinks = isolate(Matrix, 'matrixC')(<any> sources);

  const action$ = intent(sources.DOM);
  const measurements$ = measure(sources.DOM);
  const reducer$ = model(action$, measurements$);
  const allReducer$ = xs.merge(reducer$, matrixASinks.onion, matrixBSinks.onion);
  const vdom$ = view(
    sources.onion.state$,
    matrixASinks.DOM,
    matrixBSinks.DOM,
    matrixCSinks.DOM,
  );

  const sinks = {
    DOM: vdom$,
    onion: reducer$,
  };
  return sinks;
}
