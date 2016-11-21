import xs, {Stream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import delay from 'xstream/extra/delay';
import {DOMSource} from '@cycle/dom/xstream-typings';

export interface Measurements {
  matrixAHeight: number;
  matrixBWidth: number;
  matrixBHeight: number;
  rowHeight: number;
}

function isNotNull(x: Measurements | null): x is Measurements {
  return x !== null;
}

export default function measure(domSource: DOMSource): Stream<Measurements> {
  return domSource.select('.calculator').elements()
    .map((e: Element | Array<Element>) => {
      const actualElement = (Array.isArray(e) ? e[0] : e) as Element | undefined;
      if (actualElement) {
        const matrixAElem = actualElement.querySelector('.matrixA *');
        const matrixBElem = actualElement.querySelector('.matrixB *');
        const someRow = matrixAElem.querySelector('.row');
        const measurements: Measurements = {
          matrixAHeight: matrixAElem.clientHeight,
          matrixBWidth: matrixBElem.clientWidth,
          matrixBHeight: matrixBElem.clientHeight,
          rowHeight: someRow.clientHeight,
        };
        return measurements;
      } else {
        return null;
      }
    })
    .filter(isNotNull)
    .compose(dropRepeats((m1: Measurements, m2: Measurements) =>
      m1.matrixAHeight === m2.matrixAHeight &&
      m1.matrixBHeight === m2.matrixBHeight
    ))
    .compose(delay(16));
}