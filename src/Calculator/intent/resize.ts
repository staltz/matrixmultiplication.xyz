import xs, {Stream} from 'xstream';
import {DOMSource} from '@cycle/dom/xstream-typings';
import {MatrixID} from '../model';
import {ResizeAction, Direction} from './index';

function createResizeAction(target: MatrixID,
                            direction: Direction,
                            amount: number): ResizeAction {
  return {
    type: 'RESIZE',
    payload: {
      target,
      resizeParam: {
        direction,
        amount,
      },
    },
  };
}

export function resizeIntent(domSource: DOMSource): Stream<ResizeAction> {
  let decreaseRowA$ = domSource.select('.decreaseRowA').events('click')
    .mapTo(createResizeAction('A', 'row', -1));

  let increaseRowA$ = domSource.select('.increaseRowA').events('click')
    .mapTo(createResizeAction('A', 'row', +1));

  let decreaseColA$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(createResizeAction('A', 'column', -1));

  let increaseColA$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(createResizeAction('A', 'column', +1));

  let decreaseRowB$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(createResizeAction('B', 'row', -1));

  let increaseRowB$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(createResizeAction('B', 'row', +1));

  let decreaseColB$ = domSource.select('.decreaseColB').events('click')
    .mapTo(createResizeAction('B', 'column', -1));

  let increaseColB$ = domSource.select('.increaseColB').events('click')
    .mapTo(createResizeAction('B', 'column', +1));

  return xs.merge(
    decreaseRowA$, increaseRowA$,
    decreaseColA$, increaseColA$,
    decreaseRowB$, increaseRowB$,
    decreaseColB$, increaseColB$
  );
}
