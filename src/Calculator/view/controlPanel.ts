import {div, VNode} from '@cycle/dom';
import {State} from '../model/index';
import {lastCombStep} from '../model/queries';
import styles from '../styles';
import playIcon from '../../icons/play';
import nextIcon from '../../icons/next';
import endIcon from '../../icons/end';
import resetIcon from '../../icons/reset';

function getArrayOfButtons(state: State): Array<VNode> {
  const step = state.step;
  let buttons: Array<VNode> = [];
  if (step === 0) {
    buttons = [
      div(`.multiply.${styles.multiplyButton}`, [playIcon, 'Multiply'])
    ];
  } else if (step === 1 && !state.canInteract) {
    buttons = [
      div(`.multiply.${styles.multiplyButtonDisabled}`, [playIcon, 'Multiply'])
    ];
  } else if (step >= 1 && step <= lastCombStep(state) && state.canInteract) {
    buttons = [
      div(`.next.${styles.nextButton}`, [nextIcon, 'Next']),
      div(`.end.${styles.endButton}`, [endIcon, 'End']),
    ];
  } else if (step >= 1 && step <= lastCombStep(state) + 1 && !state.canInteract) {
    buttons = [
      div(`.next.${styles.nextButtonDisabled}`, [nextIcon, 'Next']),
      div(`.end.${styles.endButtonDisabled}`, [endIcon, 'End']),
    ];
  } else if (step === lastCombStep(state) + 1 && state.canInteract) {
    buttons = [
      div(`.reset.${styles.resetButton}`, [resetIcon, 'Reset']),
    ];
  }
  return buttons;
}

export function renderControlPanel(state: State): VNode {
  return div(`.controlPanel.${styles.controlPanel}`, getArrayOfButtons(state));
}
