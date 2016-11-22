import {div, span, table, tr, td, ul, li, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import matrixStyles from '../../Matrix/styles';
import {multiplySign, renderRowsResizer, renderColsResizer} from './common';

function renderOperatorGrid(state: State): VNode {
  const lastIntersectRow = state.step - 2;
  const firstIntersectRow = state.step - 2 - state.matrixB.values.numberColumns;
  const rows = state.matrixA.values.rows;
  return div(`.operatorGrid.${styles.operatorGrid}`, rows.map((row, i) => {
    const shouldShowMultiply = firstIntersectRow < i && i <= lastIntersectRow;
    return ul(`.${matrixStyles.row}`, row.map((cellVal, j) => {
      const shouldShowPlus = j < state.matrixA.values.numberColumns - 1;
      return li([
        span('.operator', {
          class: {
            [matrixStyles.cell]: true,
            [styles.operatorCell]: true,
            [styles.plusSign]: shouldShowPlus,
          },
          style: {opacity: shouldShowMultiply ? 1 : 0.01}
        }, [ multiplySign ])
      ])
    }))
  }));
}


function mutateMatrixACellsStyle(state: State) {
  const lastIntersectRow = state.step - 2;
  const firstIntersectRow = state.step - 2 - state.matrixB.values.numberColumns;
  const isCombing = (state.step === 1 && state.canInteract) || state.step > 1;
  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const rowOfCell: number = parseInt((cellElem.dataset as any).row);
      if (isCombing) {
        cellElem.classList.add(styles.animatedCell);
      } else {
        cellElem.classList.remove(styles.animatedCell);
      }
      if (firstIntersectRow < rowOfCell && rowOfCell <= lastIntersectRow) {
        cellElem.style.transform = 'scale(0.55) translateX(-16px) translateY(-10px)';
        cellElem.style.color = styles.colorPallete.blue;
      } else {
        cellElem.style.transform = null;
        cellElem.style.color = null;
      }
    }
  }
}

export function renderMatrixA(matrixA: VNode, state: State): VNode {
  const showResizers = state.step === 0;
  return table(`.matrixAWrapper.${styles.matrixWrapperTable}`, [
    tr([
      td(
        showResizers ? [renderRowsResizer('A')] : []
      ),
      td(`.matrixA.${styles.matrixA}`, {
        hook: {update: mutateMatrixACellsStyle(state)}
      }, [matrixA, renderOperatorGrid(state)]),
    ]),
    tr([
      td(),
      td(`.colsResizerContainer.${styles.colsResizerContainer}`,
        showResizers ? [renderColsResizer('A')] : []
      ),
    ]),
  ]);
}
