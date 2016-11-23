import {table, tr, td, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import {isInCombStep, lastCombStep} from '../queries';
import {renderRowsResizer, renderColsResizer} from './common';

function makeUpdateCellElements(state: State, transform: string) {
  const lastIntersectCol = state.step - 2;
  const firstIntersectCol = state.step - 2 - state.matrixA.values.numberRows;
  const rotateZTransform = (transform // string
    .split(' ') // Array<string>
    .filter(t => t.match(/^rotateZ/) !== null) // [`rotateZ(-${...})`]
    .pop() as string) // `rotateZ(-${...})`
    .replace('-', '+'); // `rotateZ(+${...})`

  return function updateCellElements(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const colOfCell: number = parseInt((cellElem.dataset as any).col);
      if (isInCombStep(state)) {
        cellElem.classList.add(styles.animatedCell);
      } else if (state.step > lastCombStep(state)) {
        setTimeout(
          () => cellElem.classList.remove(styles.animatedCell),
          styles.nextCombDuration,
        );
      }

      if (firstIntersectCol < colOfCell && colOfCell <= lastIntersectCol) {
        cellElem.style.transform = `
          ${rotateZTransform}
          scale(${styles.cellScaleWhenIntersecting})
          translateX(${styles.cellTranslateXWhenIntersecting}px)
          translateY(${-styles.cellTranslateYWhenIntersecting}px)
        `;
        cellElem.style.color = styles.colorPallete.blue;
      } else {
        cellElem.style.transform = rotateZTransform;
        cellElem.style.color = null;
      }
    }
  }
}

function getOpacity(state: State): string {
  if (state.step === lastCombStep(state) + 1 && !state.canInteract) {
    return '0.01';
  } else if (state.step === lastCombStep(state) + 1 && state.canInteract) {
    return '1';
  } else {
    return '1';
  }
}

export function renderMatrixB(matrixB: VNode, state: State, transform: string): VNode {
  const showResizers = state.step === 0;
  const opacity = getOpacity(state);
  return table(`.matrixBWrapper.${styles.matrixWrapperTable}`, [
    tr([
      td(`.matrixB.${styles.matrixB}`, {
        style: { opacity, transform, transformOrigin: 'bottom left' },
        hook: { update: makeUpdateCellElements(state, transform) },
      }, [matrixB]),
      td(
        showResizers ? [renderRowsResizer('B')] : []
      ),
    ]),
    tr([
      td(`.colsResizerContainer.${styles.colsResizerContainer}`,
        showResizers ? [renderColsResizer('B')] : []
      ),
      td(),
    ]),
  ]);
}
