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
      div(`.${styles.multiplyButton}.multiply`, [playIcon, 'Multiply'])
    ];
  } else if (state.step === 1 && !state.canInteract) {
    buttons = [
      div(`.${styles.multiplyButtonDisabled}.multiply`, [playIcon, 'Multiply'])
    ];
  } else if (state.step >= 1 && state.canInteract) {
    buttons = [
      div(`.${styles.nextButton}.next`, [nextIcon, 'Next']),
      div(`.${styles.endButton}.end`, [endIcon, 'End']),
    ];
  } else if (state.step >= 1 && !state.canInteract) {
    buttons = [
      div(`.${styles.nextButtonDisabled}.next`, [nextIcon, 'Next']),
      div(`.${styles.endButtonDisabled}.end`, [endIcon, 'End']),
    ];
  }
  return buttons;
}

export function renderControlPanel(state: State): VNode {
  return div(`.${styles.controlPanel}`, getArrayOfButtons(state));
}
