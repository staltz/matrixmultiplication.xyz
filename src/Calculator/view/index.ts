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

function renderSign(state: State): VNode {
  if ((state.step === 1 && state.canInteract) || state.step > 1) {
    return span(`.${styles.multiplyOrEqualsSign}`, '=');
  } else {
    return span(`.${styles.multiplyOrEqualsSign}`, multiplySign);
  }
}

export default function view(state$: MemoryStream<State>,
                             vdomA$: Stream<VNode>,
                             vdomB$: Stream<VNode>,
                             vdomC$: Stream<VNode | null>): Stream<VNode> {
  const transform$ = makeTransform$(state$);

  return xs.combine(state$, transform$, vdomA$, vdomB$, vdomC$.startWith(null))
    .map(([state, transform, matrixA, matrixB, matrixC]) =>
      div(`.${styles.calculator}.calculator`, [
        div(`.${styles.matrices}`, [
          renderMatrixA(matrixA, state),
          renderSign(state),
          renderMatrixB(matrixB, state, transform),
          maybeRenderMatrixC(matrixC, state),
        ]),
        renderControlPanel(state),
      ])
    );
}
