import xs, {Stream, MemoryStream} from 'xstream';
import {DOMSource} from '@cycle/dom/xstream-typings';
import {Action} from './model';

/**
 * Interprets user events as actions that can affect the state in the model.
 */
export default function intent(domSource: DOMSource): Stream<Action> {
  return domSource.select('.cell').events('input')
    .map(ev => {
      const inputEl = ev.target as HTMLInputElement;
      return {
        row: parseInt(inputEl.attributes['data-row'].value),
        col: parseInt(inputEl.attributes['data-col'].value),
        val: parseFloat(inputEl.value),
      };
    })
    .filter(action => !isNaN(action.val));
}
