import xs, {Stream, MemoryStream} from 'xstream';
import {div, span, input, ul, li, VNode} from '@cycle/dom';
import styles from './styles';
import {State} from './model';

function renderLeftBracket(state: State): VNode {
  return div(`.${styles.leftBracket}`, {key: `leftBracket${state.id}`});
}

function renderRightBracket(state: State): VNode {
  return div(`.${styles.rightBracket}`, {key: `rightBracket${state.id}`});
}

function renderAllCells(state: State): Array<VNode> {
  console['table'](state.values.rows.map((row, i) => row.map((cell, j) => `row${i} col${j}`)));
  return state.values.rows.map((row, i) =>
    ul(`.${styles.row}.row`, {key: `row${i}`}, row.map((cellValue, j) =>
      li('.col', {key: `col${j}`}, [
        state.editable ?
          input(`.${styles.cell}.cell`, {
            key: `cell${i}-${j}`,
            attrs: {
              type: 'text', 'data-row': i, 'data-col': j, value: cellValue,
            },
          }) :
          span(`.${styles.cell}.cell`, cellValue)
      ])
    ))
  );
}

export default function view(state$: MemoryStream<State>): MemoryStream<VNode> {
  return state$.map(state =>
    div(`.${styles.matrix}`, {key: state.id}, [
      renderLeftBracket(state),
      ...renderAllCells(state),
      renderRightBracket(state),
    ])
  );
}

