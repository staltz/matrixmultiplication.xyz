import xs, {Stream, MemoryStream} from 'xstream';
import {div, span, input, ul, li, VNode} from '@cycle/dom';
import styles from './styles';
import {State} from './model';

let leftBracket = div(`.${styles.leftBracket}`);
let rightBracket = div(`.${styles.rightBracket}`);

function renderAllCells(state: State): Array<VNode> {
  console['table'](state.values.rows.map((row, i) => row.map((cell, j) => `row${i} col${j}`)));
  return state.values.rows.map((row, i) =>
    ul(`.${styles.row}`, {key: `row${i}`}, row.map((cellValue, j) =>
      li({key: `col${j}`}, [
        state.editable ?
          input(`.${styles.cell}.cell`, {
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
    div(`.${styles.matrix}`, [
      leftBracket,
      ...renderAllCells(state),
      rightBracket,
    ])
  );
}

