import {State} from './index';

export function totalCombSteps(state: State): number {
  return state.matrixA.values.numberRows + state.matrixB.values.numberColumns - 2;
}

export function lastCombStep(state: State): number {
  return 2 + totalCombSteps(state);
}

export function isInCombStep(state: State): boolean {
  return ((state.step === 1 && state.canInteract) || state.step > 1) &&
    state.step <= lastCombStep(state);
}