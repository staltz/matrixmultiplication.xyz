import xs, {Stream, MemoryStream} from 'xstream';
import {DOMSource} from '@cycle/dom/xstream-typings';

export interface Action {
  row: number;
  col: number;
  val: number;
}

export default function intent(domSource: DOMSource): Stream<Action> {
  return domSource.select('input').events('input')
    .map(ev => {
      const inputEl = <HTMLInputElement>ev.target;
      return {
        row: parseInt(inputEl.attributes['data-row'].value),
        col: parseInt(inputEl.attributes['data-col'].value),
        val: parseFloat(inputEl.value),
      };
    })
    .filter(action => !isNaN(action.val));
}
