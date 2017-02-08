import xs, {Stream, MemoryStream} from 'xstream';
import {VNode, DOMSource} from '@cycle/dom';
import {StateSource} from 'cycle-onionify';
import MatrixValues from '../utils/MatrixValues';
import intent from './intent';
import model, {State, Reducer} from './model';
import view from './view';

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}

export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<(s: any) => any>;
}

export type State = State;

/**
 * The Matrix component.
 * Represents a matrix of numbers (some may be potentially null), displaying
 * them on the DOM and allowing them to be edited.
 */
export default function Matrix(sources: Sources): Sinks {
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(sources.onion.state$);

  const sinks = {
    DOM: vdom$,
    onion: reducer$,
  };
  return sinks;
}
