import xs, {Stream} from 'xstream';
import {DOMSource} from '@cycle/dom';
import {MatrixID} from '../model/index';
import {Direction, ResizeAction} from '../model/actions';

function createResizeAction(target: MatrixID,
                            direction: Direction,
                            amount: number): ResizeAction {
  return {
    target,
    resizeParam: {
      direction,
      amount,
    },
  };
}

export function resizeIntent(domSource: DOMSource): Stream<ResizeAction> {
  const  decreaseRowA$ = domSource.select('.decreaseRowA').events('click')
    .mapTo(createResizeAction('A', 'row', -1));

  const  increaseRowA$ = domSource.select('.increaseRowA').events('click')
    .mapTo(createResizeAction('A', 'row', +1));

  const  decreaseColA$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(createResizeAction('A', 'column', -1));

  const  increaseColA$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(createResizeAction('A', 'column', +1));

  const  decreaseRowB$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(createResizeAction('B', 'row', -1));

  const  increaseRowB$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(createResizeAction('B', 'row', +1));

  const  decreaseColB$ = domSource.select('.decreaseColB').events('click')
    .mapTo(createResizeAction('B', 'column', -1));

  const  increaseColB$ = domSource.select('.increaseColB').events('click')
    .mapTo(createResizeAction('B', 'column', +1));

  return xs.merge(
    decreaseRowA$, increaseRowA$,
    decreaseColA$, increaseColA$,
    decreaseRowB$, increaseRowB$,
    decreaseColB$, increaseColB$
  );
}
