import {table, tr, td, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import {renderRowsResizer, renderColsResizer} from './common';

function mutateCellsTransformStyle(state: State, transform: string) {
  const lastIntersectCol = state.step - 2;
  const firstIntersectCol = state.step - 2 - state.matrixA.values.numberRows;
  const isCombing = (state.step === 1 && state.canInteract) || state.step > 1;
  const rotateZTransform = (transform // string
    .split(' ') // Array<string>
    .filter(t => t.match(/^rotateZ/) !== null) // [`rotateZ(-${...})`]
    .pop() as string) // `rotateZ(-${...})`
    .replace('-', '+'); // `rotateZ(+${...})`

  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const colOfCell: number = parseInt((cellElem.dataset as any).col);
      if (isCombing) {
        cellElem.classList.add(styles.animatedCell);
      } else {
        cellElem.classList.remove(styles.animatedCell);
      }
      if (firstIntersectCol < colOfCell && colOfCell <= lastIntersectCol) {
        cellElem.style.transform = `${rotateZTransform}
          scale(0.55) translateX(16px) translateY(10px)`;
        cellElem.style.color = styles.colorPallete.blue;
      } else {
        cellElem.style.transform = rotateZTransform;
        cellElem.style.color = null;
      }
    }
  }
}

export function renderMatrixB(matrixB: VNode, state: State, transform: string): VNode {
  const showResizers = state.step === 0;
  return table([
    tr([
      td('.matrixB', {
        style: { transform, 'transform-origin': 'bottom left' },
        hook: { update: mutateCellsTransformStyle(state, transform) },
      }, [matrixB]),
      td(
        showResizers ? [renderRowsResizer('B')] : []
      ),
    ]),
    tr([
      td(`.${styles.colsResizerContainer}`,
        showResizers ? [renderColsResizer('B')] : []
      ),
      td(),
    ]),
  ]);
}
