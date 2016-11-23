import xs, {Stream, MemoryStream} from 'xstream';
import {div, h1, h2, a, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import {StateSource} from 'cycle-onionify';
import MatrixValues from '../utils/MatrixValues';
import Calculator from '../Calculator/index';
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
    div('.app', [
      h1(`.title.${styles.title}`, 'Matrix Multiplication'),
      calcVNode,
      h2(`.footnote.${styles.footnote}`, [
        a({attrs: {href: 'https://github.com/staltz/matrix-multiplication'}},
          'Built by @andrestaltz with Cycle.js'
        )
      ])
    ])
  );
}

export default function App(sources: Sources): Sinks {
  const calculatorSinks = Calculator(sources);
  const vdom$ = view(calculatorSinks.DOM);
  const reducer$ = calculatorSinks.onion;

  const sinks = {
    DOM: vdom$,
    onion: reducer$,
  };
  return sinks;
}