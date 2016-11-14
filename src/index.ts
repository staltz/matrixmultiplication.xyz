import xs, {Stream, MemoryStream} from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, h1, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import MatrixValues from './MatrixValues';
import Calculator from './Calculator/index';
import {style, cssRule} from 'typestyle';
import onionify, {StateSource} from 'cycle-onionify';

cssRule('body', {
  margin: 0,
  fontFamily: '"Source Sans Pro", serif',
  fontWeight: 400,
});

export type Sources = {
  DOM: DOMSource,
  onion: StateSource<any>,
}

export type Sinks = {
  DOM: Stream<VNode>,
  onion: Stream<(s: any) => any>,
}

function view(calculatorVDom: Stream<VNode>): Stream<VNode> {
  let titleClassName = style({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    fontFamily: '"Vesper Libre", serif',
    fontWeight: 400,
    textAlign: 'center',
    margin: 0,
    paddingTop: '1.5rem',
    paddingBottom: '3rem',
    zIndex: 10,
    backgroundImage:
      'linear-gradient(to bottom, ' +
        'white 0, ' +
        'rgba(255,255,255,0.9) 60%, ' +
        'transparent 100%)',
  });

  return calculatorVDom.map(calcVNode =>
    div([
      h1(`.${titleClassName}`, 'Matrix Multiplication'),
      calcVNode,
    ])
  );
}

function main(sources: Sources): Sinks {
  let calculatorSinks = Calculator(sources);
  let vdom$ = view(calculatorSinks.DOM);
  let sinks = {
    DOM: vdom$,
    onion: calculatorSinks.onion,
  };
  return sinks;
}

run(onionify(main), {
  DOM: makeDOMDriver('#main-container')
});
