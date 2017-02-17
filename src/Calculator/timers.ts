import xs, {Stream} from 'xstream';
import delay from 'xstream/extra/delay';
import dropRepeats from 'xstream/extra/dropRepeats';
import {State} from './model/index';
import {isInCombStep, lastCombStep} from './model/queries';
import styles from './styles';

/**
 * Reads the stream of state objects, and sets timers that will trigger
 * later on to emit actions of "allow continue". This is meant for
 * allowing the user to continue interacting after some animations have
 * completed. This detects when the state object has just changed the
 * `step` field.
 */
export default function timers(state$: Stream<State>): Stream<null> {
  const stateChange$ = state$
    .compose(dropRepeats((s1: State, s2: State) =>
      s1.step === s2.step && s1.canInteract === s2.canInteract
    ));

  const allowContinueFromStartMultiply$ = stateChange$
    .filter(state => state.step === 1 && !state.canInteract)
    .compose(delay(styles.step1Duration1 + styles.step1Duration2))
    .mapTo(null);

  const allowContinueFromNextComb$ = stateChange$
    .filter(state => isInCombStep(state) && !state.canInteract)
    .compose(delay(styles.nextCombDuration))
    .mapTo(null);

  const allowContinueFromEnd$ = stateChange$
    .filter(state => state.step === lastCombStep(state) + 1 && !state.canInteract)
    .compose(delay(styles.finalResultDuration))
    .mapTo(null);

  return xs.merge(
    allowContinueFromStartMultiply$,
    allowContinueFromNextComb$,
    allowContinueFromEnd$,
  );
}