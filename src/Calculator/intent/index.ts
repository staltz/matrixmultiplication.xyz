import xs, {Stream, MemoryStream} from 'xstream';
import delay from 'xstream/extra/delay';
import {DOMSource} from '@cycle/dom/xstream-typings';
import Matrix from '../../Matrix/index';
import {MatrixID} from '../model/index';
import {Action} from '../model/actions';
import {controlPanelIntent} from './controlPanel';
import {resizeIntent} from './resize';

export default function intent(domSource: DOMSource): Stream<Action> {
  const resizeAction$ = resizeIntent(domSource);
  const controlPanelAction$ = controlPanelIntent(domSource);

  return xs.merge(
    resizeAction$,
    controlPanelAction$,
  );
}