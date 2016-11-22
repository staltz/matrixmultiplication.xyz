import xs, {Stream, MemoryStream} from 'xstream';
import concat from 'xstream/extra/concat';
import tween from 'xstream/extra/tween';
import dropRepeats from 'xstream/extra/dropRepeats';
import {State} from '../model';
import styles from '../styles';

function makeWaterfallTransform$(state$: Stream<State>): Stream<string> {
  return state$
    .filter(state => state.step === 1)
    .map(state => {
      const ease = tween.power2.easeInOut;
      const xMove = 63.5; // px
      const padding = 8;
      const yLift = padding +
        state.measurements.matrixAHeight * 0.5 +
        state.measurements.matrixBHeight * 0.5;
      return concat(
        tween({ from: 0, to: yLift, duration: styles.step1Duration1, ease })
          .map(y => `
            translateX(0%)
            translateY(-${y}px)
            rotateZ(0deg)
          `),
        tween({ from: 0, to: 1, duration: styles.step1Duration2, ease })
          .map(x => `
            translateX(-${x * xMove}px)
            translateY(-${yLift}px)
            rotateZ(-${Math.pow(x, 2.3) * 90}deg)
          `),
      );
    })
    .flatten();
}

function makeStepTransform$(state$: Stream<State>): Stream<string> {
  return state$
    .filter(state => state.step > 1)
    .map(state => {
      const ease = tween.power2.easeInOut;
      const duration = styles.nextCombDuration
      const xMove = 63.5; // px
      const padding = 8;
      const yLift = padding +
        state.measurements.matrixAHeight * 0.5 +
        state.measurements.matrixBHeight * 0.5;
      const yPrev = state.step === 2 ? yLift : yLift -
        padding -
        styles.matrixBracketWidth * 2 -
        state.measurements.rowHeight * (state.step - 2);
      const yNext = yLift -
        padding -
        styles.matrixBracketWidth * 2 -
        state.measurements.rowHeight * (state.step - 1);
      return tween({ from: yPrev, to: yNext, duration, ease })
        .map(y => `
          translateX(-${xMove}px)
          translateY(${-y}px)
          rotateZ(-90deg)
        `);
    })
    .flatten();
}

export function makeTransform$(state$: MemoryStream<State>): MemoryStream<string> {
  const stateOnStepChange$ = state$
    .compose(dropRepeats((s1: State, s2: State) => s1.step === s2.step));

  return xs.merge(
    makeWaterfallTransform$(stateOnStepChange$),
    makeStepTransform$(stateOnStepChange$),
  ).startWith('translateX(0%) translateY(0px) rotateZ(0deg)');
}
