import xs, {Stream, MemoryStream} from 'xstream';
import {div, span, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import {renderMatrixA} from './matrixA';
import {renderMatrixB} from './matrixB';
import {maybeRenderMatrixC} from './matrixC';
import {renderControlPanel} from './controlPanel';
import {multiplySign} from './common';
import {makeTransform$} from './tweens';
import {isInCombStep, lastCombStep} from '../queries';

function renderSign(state: State): VNode {
  if (isInCombStep(state)) {
    return span(`.multiplySign.${styles.multiplyOrEqualsSign}`, '=');
  } else {
    return span(`.tempEqualsSign.${styles.multiplyOrEqualsSign}`, multiplySign);
  }
}

function maybeRenderEqualsSign(state: State): VNode {
  let style = {};
  if (state.step === lastCombStep(state) + 1) {
    style = {margin: '1em', width: '12px', opacity: '1'};
  } else {
    style = {margin: '0', width: '0', opacity: '0.01'};
  }
  return span(`.resultEqualsSign.${styles.resultEqualsSign}`, {style}, '=')
}

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
