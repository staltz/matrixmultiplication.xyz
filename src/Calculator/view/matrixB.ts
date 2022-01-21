import {table, tr, td, VNode} from '@cycle/dom';
import {State} from '../model/index';
import {isInCombStep, lastCombStep} from '../model/queries';
import styles from '../styles';
import {renderRowsResizer, renderColsResizer, getHighlightColors} from './common';

function getOpacity(state: State): string {
  if (state.step === lastCombStep(state) + 1 && !state.canInteract) {
    return '0.01';
  } else if (state.step === lastCombStep(state) + 1 && state.canInteract) {
    return '1';
  } else {
    return '1';
  }
}

function mutateCellStyles(state: State, transform: string) {
  const lastIntersectCol = state.step - 2;
  const firstIntersectCol = state.step - 2 - state.matrixA.values.numberRows;
  const rotateZTransform = (transform // string
    .split(' ') // Array<string>
    .filter(t => t.match(/^rotateZ/) !== null) // [`rotateZ(-${...})`]
    .pop() as string) // `rotateZ(-${...})`
    .replace('-', '+') // `rotateZ(+${...})`
    .trim();
  const highlightColors = getHighlightColors(state.matrixB.values.numberColumns);


  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
        const colOfCell: number = parseInt((cellElem.dataset as any).col);

      if (rotateZTransform === 'rotateZ(+90deg)') {
        cellElem.classList.add(styles.animatedCell);
      } else {
        cellElem.classList.remove(styles.animatedCell);
      }

      const intersectionTransform = `
          ${rotateZTransform}
          scale(${styles.cellScaleWhenIntersecting})
          translateX(${styles.cellTranslateXWhenIntersecting}px)
          translateY(${-styles.cellTranslateYWhenIntersecting}px)
        `;
      cellElem.style.color = null;
      let maxColorIndex = state.matrixB.values.numberColumns-1;
      for (let i = 0; i <= maxColorIndex; i++){
        if (firstIntersectCol < colOfCell && colOfCell <= lastIntersectCol && colOfCell === i) {
          cellElem.style.color = highlightColors[i];
        }
      }
      if (firstIntersectCol < colOfCell && colOfCell <= lastIntersectCol) {
        cellElem.style.transform = intersectionTransform;
      } else {
        cellElem.style.transform = null;
      }
    }
  }
}

export function renderMatrixB(matrixB: VNode, state: State, transform: string): VNode {
  const showResizers = state.step === 0;
  const opacity = getOpacity(state);
  return table(`.matrixBWrapper.${styles.matrixWrapperTable}`, [
    tr([
      td(`.matrixB.${styles.matrixB}`, {
        style: { opacity, transform, transformOrigin: 'bottom left' },
        hook: { update: mutateCellStyles(state, transform) },
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
