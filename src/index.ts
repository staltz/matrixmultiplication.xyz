import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import onionify from 'cycle-onionify';
import App from './App/index';
import './styles';
import {forceRenderStyles} from 'typestyle';

const main = onionify(App);

run(main, {
  DOM: makeDOMDriver('#main-container')
});
forceRenderStyles();