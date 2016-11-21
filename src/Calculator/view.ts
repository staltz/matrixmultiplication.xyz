import xs, {Stream, MemoryStream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import concat from 'xstream/extra/concat';
import tween from 'xstream/extra/tween';
import {div, span, table, tr, td, button, VNode} from '@cycle/dom';
import objectExtend from '../utils/object-extend';
import styles from './styles';
import select from 'snabbdom-selector';
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

function renderWrappedMatrixA(matrixA: VNode, showResizers: boolean): VNode {
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

function mutateCellWithTransform(transform: string): (cell: VNode) => void {
  return function mutateCell(cell: VNode) {
      cell.data = cell.data || {};
      cell.data.style = cell.data.style || {};
      cell.data.style = objectExtend(cell.data.style, { transform });
  };
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

function renderWrappedMatrixB(matrixB: VNode, showResizers: boolean, transform: string): VNode {
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
  const multiplyButtonStyle = pattern?match
    :state.step === 0?
      styles.multiplyButton
    :state.step === 1?
      styles.multiplyButtonDisabled
    :
      styles.multiplyButtonHidden
    ;

  return div(`.${styles.controlPanel}`, [
    div(`.${multiplyButtonStyle}.multiply`, '\u25B6 Multiply')
  ]);
}

function makeTransform$(state$: MemoryStream<State>): MemoryStream<string> {
  const ease1 = tween.power2.easeInOut;
  const ease2 = tween.power2.easeOut;

  return state$
    .compose(dropRepeats((s1: State, s2: State) => s1.step === s2.step))
    .filter(state => state.step === 1)
    .map(state => {
      const yLift = state.measurements.matrixAHeight * 0.5 +
        state.measurements.matrixBHeight * 0.5;
      const yDip = styles.matrixBracketWidth * 2 + state.measurements.rowHeight;
      return concat(
        tween({ from: 0, to: yLift, duration: 800, ease: ease1 }).map(y => `
          translateX(0%)
          translateY(-${y}px)
          rotateZ(0deg)
        `),
        tween({ from: 0, to: 1, duration: 700 }).map(x => `
          translateX(-${x * 63.5}px)
          translateY(-${yLift}px)
          rotateZ(-${Math.pow(x, 2.3) * 90}deg)
        `),
        tween({ from: yLift, to: yLift - yDip, duration: 700, ease: ease2 }).map(y => `
          translateX(-63.5px)
          translateY(-${y}px)
          rotateZ(-90deg)
        `)
      );
    })
    .flatten()
    .startWith('translateX(0%) translateY(0px) rotateZ(0deg)');
}

export default function view(state$: MemoryStream<State>,
                             vdomA$: Stream<VNode>,
                             vdomB$: Stream<VNode>): Stream<VNode> {
  const transform$ = makeTransform$(state$);

  return xs.combine(state$, transform$, vdomA$, vdomB$)
    .map(([state, transform, matrixA, matrixB]) =>
      div(`.${styles.calculator}.calculator`, [
        div(`.${styles.matrices}`, [
          renderWrappedMatrixA(matrixA, state.step === 0),
          span(`.${styles.multiplySign}`, '\u00D7'),
          renderWrappedMatrixB(matrixB, state.step === 0, transform),
        ]),
        renderControlPanel(state),
      ])
    );
}
