import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import onionify from 'cycle-onionify';
import App from './App/index';
import './styles';

const main = onionify(App);

requestAnimationFrame(() => {
  run(main, {
    DOM: makeDOMDriver('#main-container')
  });
});
