import xs, {Stream, MemoryStream} from 'xstream';
import {div, h1, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import MatrixValues from '../utils/MatrixValues';
import Calculator from '../Calculator/index';
import {StateSource} from 'cycle-onionify';
import styles from './styles';

export type Sources = {
  DOM: DOMSource,
  onion: StateSource<any>,
}

export type Sinks = {
  DOM: Stream<VNode>,
  onion: Stream<(s: any) => any>,
}

function view(calculatorVDom: Stream<VNode>): Stream<VNode> {
  return calculatorVDom.map(calcVNode =>
    div([
      h1(`.${styles.title}`, 'Matrix Multiplication'),
      calcVNode,
    ])
  );
}

export default function App(sources: Sources): Sinks {
  let calculatorSinks = Calculator(sources);
  let vdom$ = view(calculatorSinks.DOM);
  let sinks = {
    DOM: vdom$,
    onion: calculatorSinks.onion,
  };
  return sinks;
}