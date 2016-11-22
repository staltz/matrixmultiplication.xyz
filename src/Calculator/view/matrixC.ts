import {div, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';

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
      }
    }, [
      matrixC
    ]);
  }
}
