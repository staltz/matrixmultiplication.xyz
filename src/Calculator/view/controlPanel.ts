import {div, VNode} from '@cycle/dom';
import {State} from '../model';
import styles from '../styles';
import playIcon from '../../icons/play';
import nextIcon from '../../icons/next';
import endIcon from '../../icons/end';

function getArrayOfButtons(state: State): Array<VNode> {
  let buttons: Array<VNode> = [];
  if (state.step === 0) {
    buttons = [
      div(`.multiply.${styles.multiplyButton}`, [playIcon, 'Multiply'])
    ];
  } else if (state.step === 1 && !state.canInteract) {
    buttons = [
      div(`.multiply.${styles.multiplyButtonDisabled}`, [playIcon, 'Multiply'])
    ];
  } else if (state.step >= 1 && state.canInteract) {
    buttons = [
      div(`.next.${styles.nextButton}`, [nextIcon, 'Next']),
      div(`.end.${styles.endButton}`, [endIcon, 'End']),
    ];
  } else if (state.step >= 1 && !state.canInteract) {
    buttons = [
      div(`.next.${styles.nextButtonDisabled}`, [nextIcon, 'Next']),
      div(`.end.${styles.endButtonDisabled}`, [endIcon, 'End']),
    ];
  }
  return buttons;
}

export function renderControlPanel(state: State): VNode {
  return div(`.controlPanel.${styles.controlPanel}`, getArrayOfButtons(state));
}
