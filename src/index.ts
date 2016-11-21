import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import App from './App/index';
import onionify from 'cycle-onionify';

const main = onionify(App);

run(main, {
  DOM: makeDOMDriver('#main-container')
});
