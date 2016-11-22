import xs, {Stream, MemoryStream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import concat from 'xstream/extra/concat';
import tween from 'xstream/extra/tween';
import {div, span, table, tr, td, ul, li, button, VNode} from '@cycle/dom';
import objectExtend from '../utils/object-extend';
import {State, MatrixID} from './model';
import styles from './styles';
import matrixStyles from '../Matrix/styles';
import playIcon from '../icons/play';
import nextIcon from '../icons/next';
import endIcon from '../icons/end';

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

const multiplySign = '\u00D7';
const zeroWidthSpace = '\u200B';

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

function renderOperatorGrid(state: State): VNode {
  const lastIntersectRow = state.step - 2;
  const firstIntersectRow = state.step - 2 - state.matrixB.values.numberColumns;
  return div(`.${styles.operatorGrid}`, state.matrixA.values.rows.map((row, i) => {
    const shouldShowMultiply = firstIntersectRow < i && i <= lastIntersectRow;
    return ul(`.${matrixStyles.row}`, row.map((cellVal, j) => {
      const shouldShowPlus = j < state.matrixA.values.numberColumns - 1;
      return li([
        span({
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

function renderWrappedMatrixA(matrixA: VNode, state: State): VNode {
  const showResizers = state.step === 0;
  return table([
    tr([
      td(
        showResizers ? [renderRowsResizer('A')] : []
      ),
      td(`.matrixA.${styles.matrixAWrapper}`, {
        hook: {update: mutateMatrixACellsStyle(state)}
      }, [matrixA, renderOperatorGrid(state)]),
    ]),
    tr([
      td(),
      td(`.${styles.colsResizerContainer}`,
        showResizers ? [renderColsResizer('A')] : []
      ),
    ]),
  ]);
}

function mutateCellsTransformStyle(state: State, transform: string) {
  const lastIntersectCol = state.step - 2;
  const firstIntersectCol = state.step - 2 - state.matrixA.values.numberRows;
  const isCombing = (state.step === 1 && state.canInteract) || state.step > 1;
  const rotateZTransform = (transform // string
    .split(' ') // Array<string>
    .filter(t => t.match(/^rotateZ/) !== null) // [`rotateZ(-${...})`]
    .pop() as string) // `rotateZ(-${...})`
    .replace('-', '+'); // `rotateZ(+${...})`

  return function updateHook(prev: VNode, next: VNode) {
    const all = (next.elm as Element).querySelectorAll('.cell');
    for (let i = 0, N = all.length; i < N; i++) {
      const cellElem = all.item(i) as HTMLElement;
      const colOfCell: number = parseInt((cellElem.dataset as any).col);
      if (isCombing) {
        cellElem.classList.add(styles.animatedCell);
      } else {
        cellElem.classList.remove(styles.animatedCell);
      }
      if (firstIntersectCol < colOfCell && colOfCell <= lastIntersectCol) {
        cellElem.style.transform = `${rotateZTransform}
          scale(0.55) translateX(16px) translateY(10px)`;
        cellElem.style.color = styles.colorPallete.blue;
      } else {
        cellElem.style.transform = rotateZTransform;
        cellElem.style.color = null;
      }
    }
  }
}

function renderWrappedMatrixB(matrixB: VNode, state: State, transform: string): VNode {
  const showResizers = state.step === 0;
  return table([
    tr([
      td('.matrixB', {
        style: { transform, 'transform-origin': 'bottom left' },
        hook: { update: mutateCellsTransformStyle(state, transform) },
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
    :state.step >= 1 && state.canInteract?
      [
        div(`.${styles.nextButton}.next`, [nextIcon, 'Next']),
        div(`.${styles.endButton}.end`, [endIcon, 'End']),
      ]
    :state.step >= 1 && !state.canInteract?
      [
        div(`.${styles.nextButtonDisabled}.next`, [nextIcon, 'Next']),
        div(`.${styles.endButtonDisabled}.end`, [endIcon, 'End']),
      ]
    :
      [
      ]
  );
}

function makeWaterfallTransform$(state$: Stream<State>): Stream<string> {
  return state$
    .filter(state => state.step === 1)
    .map(state => {
      const ease = tween.power2.easeInOut;
      const xMove = 63.5; // px
      const padding = 8;
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
    .flatten();
}

function makeStepTransform$(state$: Stream<State>): Stream<string> {
  return state$
    .filter(state => state.step > 1)
    .map(state => {
      const ease = tween.power2.easeInOut;
      const duration = styles.nextCombDuration
      const xMove = 63.5; // px
      const padding = 8;
      const yLift = padding +
        state.measurements.matrixAHeight * 0.5 +
        state.measurements.matrixBHeight * 0.5;
      const yPrev = state.step === 2 ? yLift : yLift -
        padding -
        styles.matrixBracketWidth * 2 -
        state.measurements.rowHeight * (state.step - 2);
      const yNext = yLift -
        padding -
        styles.matrixBracketWidth * 2 -
        state.measurements.rowHeight * (state.step - 1);
      return tween({ from: yPrev, to: yNext, duration, ease })
        .map(y => `
          translateX(-${xMove}px)
          translateY(${-y}px)
          rotateZ(-90deg)
        `);
    })
    .flatten();
}

function makeTransform$(state$: MemoryStream<State>): MemoryStream<string> {
  const stateOnStepChange$ = state$
    .compose(dropRepeats((s1: State, s2: State) => s1.step === s2.step));

  return xs.merge(
    makeWaterfallTransform$(stateOnStepChange$),
    makeStepTransform$(stateOnStepChange$),
  ).startWith('translateX(0%) translateY(0px) rotateZ(0deg)');
}

function renderSign(state: State): VNode {
  if ((state.step === 1 && state.canInteract) || state.step > 1) {
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
    const yDist = state.measurements.matrixAHeight * 0.5;
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
