import xs, {Stream, MemoryStream} from 'xstream';
import delay from 'xstream/extra/delay';
import {DOMSource} from '@cycle/dom';
import Matrix from '../../Matrix/index';
import {MatrixID} from '../model/index';
import {ResizeAction} from '../model/actions';
import {controlPanelIntent} from './controlPanel';
import {resizeIntent} from './resize';

/**
 * Interprets user events as actions that can affect the state in the model.
 */
export default function intent(domSource: DOMSource) {
  const resizeAction$ = resizeIntent(domSource);
  const controlPanelActions = controlPanelIntent(domSource);

  return {
    resizeAction$,
    ...controlPanelActions,
  }
}