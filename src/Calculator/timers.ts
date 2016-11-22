import xs, {Stream, MemoryStream} from 'xstream';
import delay from 'xstream/extra/delay';
import dropRepeats from 'xstream/extra/dropRepeats';
import {State} from './model';
import {AllowContinueAction} from './intent';
import styles from './styles';
import {isInCombStep, lastCombStep} from './queries';

export default function timers(state$: Stream<State>): Stream<AllowContinueAction> {
  const stateChange$ = state$
    .compose(dropRepeats((s1: State, s2: State) =>
      s1.step === s2.step && s1.canInteract === s2.canInteract
    ));

  const allowContinueFromStartMultiply$ = stateChange$
    .filter(state => state.step === 1 && !state.canInteract)
    .compose(delay(styles.step1Duration1 + styles.step1Duration2))
    .mapTo({ type: 'ALLOW_CONTINUE', payload: null} as AllowContinueAction);

  const allowContinueFromNextComb$ = stateChange$
    .filter(state => isInCombStep(state) && !state.canInteract)
    .compose(delay(styles.nextCombDuration))
    .mapTo({ type: 'ALLOW_CONTINUE', payload: null} as AllowContinueAction);

  const allowContinueFromEnd$ = stateChange$
    .filter(state => state.step === lastCombStep(state) + 1 && !state.canInteract)
    .compose(delay(styles.finalResultDuration))
    .mapTo({ type: 'ALLOW_CONTINUE', payload: null} as AllowContinueAction);

  return xs.merge(
    allowContinueFromStartMultiply$,
    allowContinueFromNextComb$,
    allowContinueFromEnd$,
  );
}