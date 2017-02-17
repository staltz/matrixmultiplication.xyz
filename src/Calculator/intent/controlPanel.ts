import xs, {Stream} from 'xstream';
import {DOMSource} from '@cycle/dom';

export function controlPanelIntent(domSource: DOMSource) {
  const startMultiplyAction$ = domSource
    .select('.multiply').events('click')
    .mapTo(null);

  const nextStepAction$ = domSource
    .select('.next').events('click')
    .mapTo(null);

  const endAction$ = domSource
    .select('.end').events('click')
    .mapTo(null);

  const resetAction$ = domSource
    .select('.reset').events('click')
    .mapTo(null);

  return {
    startMultiplyAction$,
    nextStepAction$,
    endAction$,
    resetAction$,
  };
}