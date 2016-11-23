import xs, {Stream, MemoryStream} from 'xstream';
import {div, span, VNode} from '@cycle/dom';
import {State} from '../model/index';
import {isInCombStep, lastCombStep} from '../model/queries';
import styles from '../styles';
import {renderMatrixA} from './matrixA';
import {renderMatrixB} from './matrixB';
import {maybeRenderMatrixC} from './matrixC';
import {renderControlPanel} from './controlPanel';
import {multiplySign} from './common';
import {makeTransform$} from './tweens';

function renderSign(state: State): VNode {
  if (isInCombStep(state)) {
    return span(`.multiplySign.${styles.multiplyOrEqualsSign}`, '=');
  } else {
    return span(`.tempEqualsSign.${styles.multiplyOrEqualsSign}`, multiplySign);
  }
}

function maybeRenderEqualsSign(state: State): VNode | null {
  let style = {};
  if (state.step === lastCombStep(state) + 1) {
    style = {margin: '1em', width: '12px', opacity: '1'};
  } else if (state.step === 0) {
    return null;
  } else {
    style = {margin: '0', width: '0', opacity: '0.01'};
  }
  return span(`.resultEqualsSign.${styles.resultEqualsSign}`, {style}, '=')
}

/**
 * Creates a visual representation ("VNode") of the state.
 * Includes also the visual representations of child matrices.
 */
export default function view(state$: MemoryStream<State>,
                             vdomA$: Stream<VNode>,
                             vdomB$: Stream<VNode>,
                             vdomC$: Stream<VNode | null>): Stream<VNode> {
  const transform$ = makeTransform$(state$);

  return xs.combine(state$, transform$, vdomA$, vdomB$, vdomC$.startWith(null))
    .map(([state, transform, matrixA, matrixB, matrixC]) =>
      div(`.calculator.${styles.calculator}`, [
        div(`.matrices.${styles.matrices}`, [
          renderMatrixA(matrixA, state),
          renderSign(state),
          renderMatrixB(matrixB, state, transform),
          maybeRenderEqualsSign(state),
          maybeRenderMatrixC(matrixC, state),
        ]),
        renderControlPanel(state),
      ])
    );
}
