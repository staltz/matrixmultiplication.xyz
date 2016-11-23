import {div, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import {lastCombStep, isInCombStep} from '../queries';

function mutateCellsStyle(state: State) {
  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const rowOfCell: number = parseInt((cellElem.dataset as any).row);
      const colOfCell: number = parseInt((cellElem.dataset as any).col);
      if (isInCombStep(state)) {
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
  const step = state.step;
  if (matrixC === null || step === 0 || (step === 1 && !state.canInteract)) {
    return div('.matrixC', {
      class: { [styles.matrixCHidden]: true },
      style: { opacity: '0.01', marginLeft: '0' },
    });
  } else {
    matrixC.data = matrixC.data || {};
    matrixC.data.style = matrixC.data.style || {};
    matrixC.data.style.position = 'absolute';
    const xDist = state.measurements.matrixBWidth + 8;
    const yDist = state.measurements.matrixAHeight * 0.5;
    return div('.matrixC', {
      class: { [styles.matrixC]: true },
      style: {
        transform: `translateX(-${xDist}px) translateY(-${yDist}px)`,
        opacity: '1',
        marginLeft: step === lastCombStep(state) + 1 ? `${xDist}px` : '0',
      },
      hook: {
        update: mutateCellsStyle(state),
      },
    }, [
      matrixC
    ]);
  }
}
