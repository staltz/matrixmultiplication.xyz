import xs, {Stream} from 'xstream';
import {VNode, DOMSource} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {StateSource} from 'cycle-onionify';
import MatrixValues from '../utils/MatrixValues';
import Matrix from '../Matrix/index';
import measure from './measure';
import timers from './timers';
import intent from './intent/index';
import model, {State, Reducer} from './model/index';
import view from './view/index';

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}

/**
 * The Calculator component.
 * Contains two input matrices, A and B, and one output matrix, C.
 * Contains also resizing controls, and a calculation control panel
 * (start, continue, etc).
 * Performs actual matrix calculation and visualizes the calculation
 * as animations.
 */
export default function Calculator(sources: Sources): Sinks {
  const aSinks: Sinks = isolate(Matrix, 'matrixA')(sources);
  const bSinks: Sinks = isolate(Matrix, 'matrixB')(sources);
  const cSinks: Sinks = isolate(Matrix, 'matrixC')(sources);

  const state$ = sources.onion.state$;
  const measurements$ = measure(sources.DOM);
  const actions = {...intent(sources.DOM), allowContinueAction$: timers(state$)};
  const reducer$ = model(actions, measurements$);
  const allReducer$ = xs.merge(reducer$, aSinks.onion, bSinks.onion);
  const vdom$ = view(state$, aSinks.DOM, bSinks.DOM, cSinks.DOM);

  const sinks = {
    DOM: vdom$,
    onion: allReducer$,
  };
  return sinks;
}
