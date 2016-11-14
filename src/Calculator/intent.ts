import xs, {Stream, MemoryStream} from 'xstream';
import {DOMSource} from '@cycle/dom/xstream-typings';
import Matrix from '../Matrix/index';
import {MatrixID} from './model';

export interface Action {
  type: 'RESIZE' | 'START_MULTIPLY';
  payload: any;
}

export interface ResizeAction {
  target: MatrixID;
  resizeParam: {
    direction: 'row' | 'column';
    amount: number;
  };
}

function resizeIntent(domSource: DOMSource): Stream<ResizeAction> {
  let decreaseRowA$ = domSource.select('.decreaseRowA').events('click')
    .mapTo(<ResizeAction>{
      target: 'A',
      resizeParam: {
        direction: 'row',
        amount: -1,
      }
    });

  let increaseRowA$ = domSource.select('.increaseRowA').events('click')
    .mapTo(<ResizeAction>{
      target: 'A',
      resizeParam: {
        direction: 'row',
        amount: +1,
      }
    });

  let decreaseColA$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(<ResizeAction>{
      target: 'A',
      resizeParam: {
        direction: 'column',
        amount: -1,
      }
    });

  let increaseColA$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(<ResizeAction>{
      target: 'A',
      resizeParam: {
        direction: 'column',
        amount: +1,
      }
    });

  let decreaseRowB$ = xs
    .merge(
      domSource.select('.decreaseColA').events('click'),
      domSource.select('.decreaseRowB').events('click')
    ).mapTo(<ResizeAction>{
      target: 'B',
      resizeParam: {
        direction: 'row',
        amount: -1,
      }
    });

  let increaseRowB$ = xs
    .merge(
      domSource.select('.increaseColA').events('click'),
      domSource.select('.increaseRowB').events('click')
    ).mapTo(<ResizeAction>{
      target: 'B',
      resizeParam: {
        direction: 'row',
        amount: +1,
      }
    });

  let decreaseColB$ = domSource.select('.decreaseColB').events('click')
    .mapTo(<ResizeAction>{
      target: 'B',
      resizeParam: {
        direction: 'column',
        amount: -1,
      }
    });

  let increaseColB$ = domSource.select('.increaseColB').events('click')
    .mapTo(<ResizeAction>{
      target: 'B',
      resizeParam: {
        direction: 'column',
        amount: +1,
      }
    });

  return xs.merge(
    decreaseRowA$, increaseRowA$,
    decreaseColA$, increaseColA$,
    decreaseRowB$, increaseRowB$,
    decreaseColB$, increaseColB$
  );
}

function startMultiplyAction$(domSource: DOMSource): Stream<Action> {
  return domSource.select('.multiply').events('click')
    .mapTo({ type: 'START_MULTIPLY', payload: null }) as Stream<Action>;
}

export default function intent(domSource: DOMSource): Stream<Action> {
  let resizeAction$ = resizeIntent(domSource).map(a => ({
    type: 'RESIZE',
    payload: a,
  })) as Stream<Action>;
  return xs.merge(resizeAction$, startMultiplyAction$(domSource));
}