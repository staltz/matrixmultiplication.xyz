import {MemoryStream} from 'xstream';
import {div, span, input, VNode} from '@cycle/dom';
import {State} from './model';
import styles from './styles';

const zeroWidthSpace = '\u200B';

function renderLeftBracket(state: State): VNode {
  return div(`.leftBracket.${styles.leftBracket}`, {
    key: `leftBracket${state.id}`,
  });
}

function renderRightBracket(state: State): VNode {
  return div(`.rightBracket.${styles.rightBracket}`, {
    key: `rightBracket${state.id}`,
  });
}

function isNumberHuge(num: number) {
  return Number(num).toFixed(0).length > 5;
}

function isDecimalIrrelevant(decimals: number) {
  return Math.abs(decimals) < 0.0000001;
}

function isDecimalOneDigit(decimals: number) {
  return Number(decimals).toFixed(2) === (Number(decimals).toFixed(1) + '0')
}

function isNumberLengthy(num: number){
  return Number(Math.abs(num)).toFixed(0).length > 3
    && Number(num).toFixed(2).length > 7;
}

function formatNumber(num: number): string {
  const decimalPart = num < 0 ? num - Math.ceil(num) : num - Math.floor(num);
  if (isNumberHuge(num)) return Number(num).toPrecision(3);
  if (isDecimalIrrelevant(decimalPart)) return Number(num).toFixed(0);
  if (isDecimalOneDigit(decimalPart)) return Number(num).toFixed(1);
  if (isNumberLengthy(num)) return Number(num).toFixed(0);
  return Number(num).toFixed(2);
}

function fontSizeFor(num: number | null) {
  if (num === null) return styles.cellFontSize2;
  const str = formatNumber(num);
  const len = str.length;
  const hasDot = str.indexOf('.') > -1;
  const hasMinus = str.indexOf('-') > -1;
  if (/^\d\.\d\de\+\d$/.test(str)) return styles.cellFontSize6;
  if (hasDot || hasMinus) {
    if (len <= 3) return styles.cellFontSize2;
    if (len === 4) return styles.cellFontSize3;
    if (len === 5) return styles.cellFontSize4;
    if (len === 6) return styles.cellFontSize5;
    if (len === 7) return styles.cellFontSize6;
    if (len >= 8) return styles.cellFontSize7;
  } else {
    if (len <= 2) return styles.cellFontSize2;
    if (len === 3) return styles.cellFontSize3;
    if (len === 4) return styles.cellFontSize4;
    if (len === 5) return styles.cellFontSize5;
    if (len === 6) return styles.cellFontSize6;
    if (len >= 7) return styles.cellFontSize7;
  }
}

function fontSizeStyleFor(num: number | null) {
  if (fontSizeFor(num) === styles.cellFontSize2) return styles.cell2;
  if (fontSizeFor(num) === styles.cellFontSize3) return styles.cell3;
  if (fontSizeFor(num) === styles.cellFontSize4) return styles.cell4;
  if (fontSizeFor(num) === styles.cellFontSize5) return styles.cell5;
  if (fontSizeFor(num) === styles.cellFontSize6) return styles.cell6;
  if (fontSizeFor(num) === styles.cellFontSize7) return styles.cell7;
  else return styles.cell2;
}

function updateFontSizeHook(prev: VNode, next?: VNode) {
  const vnode = next ? next : prev;
  if (isNaN((vnode.data as any).attrs.value)) return;
  if (!vnode.elm) return;
  const cellValue = 0 + (vnode.data as any).attrs.value;
  (vnode.elm as HTMLElement).style.fontSize = fontSizeFor(cellValue) + 'px';
}

function renderCellAsInput(cellValue: number | null, i: number, j: number): VNode {
  return input(`.cell.${styles.cell}`, {
    key: `cell${i}-${j}`,
    hook: {insert: updateFontSizeHook, update: updateFontSizeHook},
    attrs: {
      type: 'text', 'data-row': i, 'data-col': j,
      value: typeof cellValue === 'number' ? cellValue : void 0,
    },
  });
}

function renderCellAsSpan(cellValue: number | null, i: number, j: number): VNode {
  return span(`.cell.${styles.cell}.${fontSizeStyleFor(cellValue)}`, {
    attrs: {
      'data-row': i, 'data-col': j
    },
  }, typeof cellValue === 'number' ? [formatNumber(cellValue)] : [zeroWidthSpace])
}

function renderAllCells(state: State): Array<VNode> {
  return state.values.rows.map((row, i) =>
    div(`.row.${styles.row}`, {key: `row${i}`}, row.map((cellValue, j) =>
      div('.col', {key: `col${j}`}, [
        state.editable ?
          renderCellAsInput(cellValue, i, j) :
          renderCellAsSpan(cellValue, i, j)
      ])
    ))
  );
}

/**
 * Creates a visual representation ("VNode") of the state.
 */
export default function view(state$: MemoryStream<State>): MemoryStream<VNode> {
  return state$.map(state =>
    div(`.matrix.${styles.matrix}`, {key: state.id}, [
      renderLeftBracket(state),
      ...renderAllCells(state),
      renderRightBracket(state),
    ])
  );
}

