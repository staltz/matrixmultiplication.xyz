import {div, VNode} from '@cycle/dom';
import {MatrixID} from '../model/index';
import styles from '../styles';
import Styles from "../styles";
import highlightColorsPalliate = Styles.highlightColorsPalliate;

export const multiplySign = '\u00D7';
export const zeroWidthSpace = '\u200B';

export function renderRowsResizer(id: MatrixID): VNode {
  return div(`.rowsResizer.${styles.rowsResizer}`, [
    div(`.decreaseRow${id}.${styles.resizerButton}`, '-'),
    div(`.increaseRow${id}.${styles.resizerButton}`, '+'),
  ]);
}

export function renderColsResizer(id: MatrixID): VNode {
  return div(`.colsResizer.${styles.colsResizer}`, [
    div(`.decreaseCol${id}.${styles.resizerButton}`, '-'),
    div(`.increaseCol${id}.${styles.resizerButton}`, '+'),
  ]);
}
export function getHighlightColors(minLength: number): string[]{
  let highlightColors = highlightColorsPalliate;
  while (highlightColors.length < minLength){
    highlightColors = highlightColors.concat(highlightColorsPalliate);
  }
  return highlightColors;
}