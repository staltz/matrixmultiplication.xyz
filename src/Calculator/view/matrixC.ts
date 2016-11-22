import {div, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';

function mutateCellsStyle(state: State) {
  const isCombing = (state.step === 1 && state.canInteract) || state.step > 1;

  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const rowOfCell: number = parseInt((cellElem.dataset as any).row);
      const colOfCell: number = parseInt((cellElem.dataset as any).col);
      if (isCombing) {
        cellElem.classList.add(styles.animatedCell);
      } else {
        cellElem.classList.remove(styles.animatedCell);
      }
      if (rowOfCell + colOfCell > state.step - 2) {
        cellElem.style.color = null;
        cellElem.style.opacity = '0.01';
      } else if (rowOfCell + colOfCell === state.step - 2) {
        cellElem.style.color = styles.colorPallete.blue;
        cellElem.style.opacity = '1';
      } else {
        cellElem.style.color = null;
        cellElem.style.opacity = '1';
      }
    }
  }
}

export function maybeRenderMatrixC(matrixC: VNode | null, state: State): VNode | null {
  if (matrixC === null || (state.step <= 1 && !state.canInteract)) {
    return div(`.matrixC.${styles.resultMatrix}`, {style: { opacity: '0' }});
  } else {
    matrixC.data = matrixC.data || {};
    matrixC.data.style = matrixC.data.style || {};
    matrixC.data.style.position = 'absolute';
    const xDist = state.measurements.matrixBWidth + 8;
    const yDist = state.measurements.matrixAHeight * 0.5;
    return div(`.matrixC.${styles.resultMatrix}`, {
      style: {
        transform: `translateX(-${xDist}px) translateY(-${yDist}px)`,
        opacity: '1',
      },
      hook: {
        update: mutateCellsStyle(state),
      },
    }, [
      matrixC
    ]);
  }
}
