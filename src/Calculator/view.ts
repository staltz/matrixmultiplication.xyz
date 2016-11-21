import xs, {Stream, MemoryStream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import concat from 'xstream/extra/concat';
import tween from 'xstream/extra/tween';
import {div, span, table, tr, td, button, VNode} from '@cycle/dom';
import objectExtend from '../utils/object-extend';
import styles from './styles';
import select from 'snabbdom-selector';
import playIcon from '../icons/play';
import nextIcon from '../icons/next';
import endIcon from '../icons/end';
import {State, MatrixID} from './model';

function renderRowsResizer(id: MatrixID): VNode {
  return div(`.${styles.rowsResizer}`, [
    div(`.${styles.resizerButton}.decreaseRow${id}`, '-'),
    div(`.${styles.resizerButton}.increaseRow${id}`, '+'),
  ]);
}

function renderColsResizer(id: MatrixID): VNode {
  return div(`.${styles.colsResizer}`, [
    div(`.${styles.resizerButton}.decreaseCol${id}`, '-'),
    div(`.${styles.resizerButton}.increaseCol${id}`, '+'),
  ]);
}

function renderWrappedMatrixA(matrixA: VNode, state: State): VNode {
  const showResizers = state.step === 0;
  return table([
    tr([
      td(
        showResizers ? [renderRowsResizer('A')] : []
      ),
      td('.matrixA', [matrixA]),
    ]),
    tr([
      td(),
      td(`.${styles.colsResizerContainer}`,
        showResizers ? [renderColsResizer('A')] : []
      ),
    ]),
  ]);
}

function mutateCellsTransformStyle(transform: string) {
  const rotateZTransform = (transform // string
    .split(' ') // Array<string>
    .filter(t => t.match(/^rotateZ/) !== null) // [`rotateZ(-${...})`]
    .pop() as string) // `rotateZ(-${...})`
    .replace('-', '+'); // `rotateZ(+${...})`

  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      cellElem.style.transform = rotateZTransform;
    }
  }
}

function renderWrappedMatrixB(matrixB: VNode, state: State, transform: string): VNode {
  const showResizers = state.step === 0;
  return table([
    tr([
      td('.matrixB', {
        style: { transform, 'transform-origin': 'bottom left' },
        hook: { update: mutateCellsTransformStyle(transform) },
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

const pattern = false;
const match = false;

function renderControlPanel(state: State): VNode {
  return div(`.${styles.controlPanel}`, pattern?match
    :state.step === 0?
      [
        div(`.${styles.multiplyButton}.multiply`, [playIcon, 'Multiply'])
      ]
    :state.step === 1 && !state.canInteract?
      [
        div(`.${styles.multiplyButtonDisabled}.multiply`, [playIcon, 'Multiply'])
      ]
    :state.step === 1 && state.canInteract?
      [
        div(`.${styles.nextButton}.next`, [nextIcon, 'Next']),
        div(`.${styles.endButton}.end`, [endIcon, 'End']),
      ]
    :
      [
      ]
  );
}

function makeTransform$(state$: MemoryStream<State>): MemoryStream<string> {
  return state$
    .compose(dropRepeats((s1: State, s2: State) => s1.step === s2.step))
    .filter(state => state.step === 1)
    .map(state => {
      const ease = tween.power2.easeInOut;
      const xMove = 63.5; // px
      const padding = 10;
      const yLift = padding +
        state.measurements.matrixAHeight * 0.5 +
        state.measurements.matrixBHeight * 0.5;
      return concat(
        tween({ from: 0, to: yLift, duration: styles.step1Duration1, ease })
          .map(y => `
            translateX(0%)
            translateY(-${y}px)
            rotateZ(0deg)
          `),
        tween({ from: 0, to: 1, duration: styles.step1Duration2, ease })
          .map(x => `
            translateX(-${x * xMove}px)
            translateY(-${yLift}px)
            rotateZ(-${Math.pow(x, 2.3) * 90}deg)
          `),
      );
    })
    .flatten()
    .startWith('translateX(0%) translateY(0px) rotateZ(0deg)');
}

function renderSign(state: State): VNode {
  if (state.step >= 1 && state.canInteract) {
    return span(`.${styles.multiplyOrEqualsSign}`, '=');
  } else {
    return span(`.${styles.multiplyOrEqualsSign}`, '\u00D7');
  }
}

function maybeRenderMatrixC(matrixC: VNode | null, state: State): VNode | null {
  if (matrixC === null || (state.step <= 1 && !state.canInteract)) {
    return div(`.${styles.resultMatrix}.matrixC`, {style: { opacity: '0' }});
  } else {
    matrixC.data = matrixC.data || {};
    matrixC.data.style = matrixC.data.style || {};
    matrixC.data.style.position = 'absolute';
    const xDist = state.measurements.matrixBWidth + 8;
    const yDist = state.measurements.matrixBHeight;
    return div(`.${styles.resultMatrix}.matrixC`, {
      style: {
        transform: `translateX(-${xDist}px) translateY(-${yDist}px)`,
        opacity: '1',
      }
    }, [
      matrixC
    ]);
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
          renderWrappedMatrixA(matrixA, state),
          renderSign(state),
          renderWrappedMatrixB(matrixB, state, transform),
          maybeRenderMatrixC(matrixC, state),
        ]),
        renderControlPanel(state),
      ])
    );
}
