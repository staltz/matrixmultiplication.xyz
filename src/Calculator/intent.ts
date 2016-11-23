import xs, {Stream, MemoryStream} from 'xstream';
import delay from 'xstream/extra/delay';
import {DOMSource} from '@cycle/dom/xstream-typings';
import Matrix from '../Matrix/index';
import {MatrixID} from './model';

export type Direction = 'row' | 'column';

export type Action =
  ResizeAction |
  StartMultiplyAction |
  AllowContinueAction |
  NextStepAction |
  ResetAction |
  EndAction;

export interface ResizeAction {
  type: 'RESIZE';
  payload: {
    target: MatrixID;
    resizeParam: {
      direction: Direction;
      amount: number;
    };
  }
}

export interface StartMultiplyAction {
  type: 'START_MULTIPLY';
  payload: null;
}

export interface AllowContinueAction {
  type: 'ALLOW_CONTINUE';
  payload: null;
}

export interface NextStepAction {
  type: 'NEXT_STEP';
  payload: null;
}

export interface ResetAction {
  type: 'RESET';
  payload: null;
}

export interface EndAction {
  type: 'END';
  payload: null;
}

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

export function isResizeAction(ac: Action): ac is ResizeAction {
  return ac.type === 'RESIZE';
}

export function isStartMultiplyAction(ac: Action): ac is StartMultiplyAction {
  return ac.type === 'START_MULTIPLY';
}

export function isAllowContinueAction(ac: Action): ac is AllowContinueAction {
  return ac.type === 'ALLOW_CONTINUE';
}

export function isNextStepAction(ac: Action): ac is NextStepAction {
  return ac.type === 'NEXT_STEP';
}

export function isResetAction(ac: Action): ac is ResetAction {
  return ac.type === 'RESET';
}

export function isEndAction(ac: Action): ac is EndAction {
  return ac.type === 'END';
}

function resizeIntent(domSource: DOMSource): Stream<ResizeAction> {
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

function stepIntent(domSource: DOMSource): Stream<Action> {
  const startMultiplyAction$ = domSource.select('.multiply').events('click')
    .mapTo({ type: 'START_MULTIPLY', payload: null } as StartMultiplyAction);

  const nextStepAction$ = domSource.select('.next').events('click')
    .mapTo({ type: 'NEXT_STEP', payload: null } as NextStepAction);

  return xs.merge(startMultiplyAction$, nextStepAction$);
}

function resetIntent(domSource: DOMSource): Stream<Action> {
  return domSource.select('.reset').events('click')
    .mapTo({ type: 'RESET', payload: null } as ResetAction);
}

function endIntent(domSource: DOMSource): Stream<Action> {
  return domSource.select('.end').events('click')
    .mapTo({ type: 'END', payload: null } as EndAction);
}

export default function intent(domSource: DOMSource): Stream<Action> {
  const resizeAction$ = resizeIntent(domSource);
  const stepAction$ = stepIntent(domSource);
  const resetAction$ = resetIntent(domSource);
  const endAction$ = endIntent(domSource);
  return xs.merge(resizeAction$, stepAction$, resetAction$, endAction$);
}