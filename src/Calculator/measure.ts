import xs, {Stream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import delay from 'xstream/extra/delay';
import {DOMSource} from '@cycle/dom';

export interface Measurements {
  matrixAHeight: number;
  matrixBWidth: number;
  matrixBHeight: number;
  rowHeight: number;
}

function isNotNull(x: Measurements | null): x is Measurements {
  return x !== null;
}

/**
 * Provides a stream of measurements of elements on the DOM, such as the
 * width and height (in pixels) of the matrices.
 */
export default function measure(domSource: DOMSource): Stream<Measurements> {
  return domSource.select('.calculator').elements()
    .map((e: Element | Array<Element>) => {
      const actualElement = (Array.isArray(e) ? e[0] : e) as Element | undefined;
      if (!actualElement) {
        return null;
      }
      const matrixAElem = actualElement.querySelector('.matrixA *');
      const matrixBElem = actualElement.querySelector('.matrixB *');
      if (!matrixAElem || !matrixBElem) {
        return null;
      }
      const someRow = matrixAElem.querySelector('.row');
      if (!someRow) {
        return null;
      }
      const measurements: Measurements = {
        matrixAHeight: matrixAElem.clientHeight,
        matrixBWidth: matrixBElem.clientWidth,
        matrixBHeight: matrixBElem.clientHeight,
        rowHeight: someRow.clientHeight,
      };
      return measurements;
    })
    .filter(isNotNull)
    .compose(dropRepeats((m1: Measurements, m2: Measurements) =>
      m1.matrixAHeight === m2.matrixAHeight &&
      m1.matrixBHeight === m2.matrixBHeight &&
      m1.matrixBWidth === m2.matrixBWidth
    ))
    .compose(delay(16));
}