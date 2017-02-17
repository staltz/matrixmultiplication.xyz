import xs, {Stream} from 'xstream';
import MatrixValues from '../../utils/MatrixValues';
import {State as MatrixState} from '../../Matrix/index';
import {ResizeAction} from './actions';
import {updateMeasurementsReducer$} from './reducers/measure';
import {resizeReducer$} from './reducers/resize';
import {
  startMultiplyReducer$,
  nextStepReducer$,
  fastForwardToEndReducer$,
  resetReducer$,
} from './reducers/controlPanel';
import {allowContinueReducer$} from './reducers/timers';

export interface State {
  step: number;
  canInteract: boolean;
  fastForwardToEnd: boolean;
  measurements: Measurements;
  matrixA: MatrixState;
  matrixB: MatrixState;
  matrixC: MatrixState | undefined;
}

export type MatrixID = 'A' | 'B';

export interface Measurements {
  matrixAHeight: number;
  matrixBWidth: number;
  matrixBHeight: number;
  rowHeight: number;
}

export type Reducer = (oldState: State) => State;

const defaultState: State = {
  step: 0,
  canInteract: true,
  fastForwardToEnd: false,
  measurements: {
    matrixAHeight: 0,
    matrixBWidth: 0,
    matrixBHeight: 0,
    rowHeight: 0,
  },
  matrixA: {
    values: MatrixValues.from([[1, 2, 1], [0, 1, 0], [2, 3, 4]]),
    editable: true,
    id: 'A',
  },
  matrixB: {
    values: MatrixValues.from([[2, 5], [6, 7], [1, 8]]),
    editable: true,
    id: 'B',
  },
  matrixC: void 0,
};

const initReducer$ = xs.of(
  function initReducer(prevState: State) {
    if (!prevState) {
      return defaultState;
    } else {
      return prevState;
    }
  }
);

export interface Actions {
  allowContinueAction$: xs<null>;
  startMultiplyAction$: xs<null>;
  nextStepAction$: xs<null>;
  endAction$: xs<null>;
  resetAction$: xs<null>;
  resizeAction$: xs<ResizeAction>;
}

/**
 * Controls modifications to state, through the emission of reducer functions.
 */
export default function model(actions: Actions,
                              measurements$: Stream<Measurements>): Stream<Reducer> {
  return xs.merge(
    initReducer$,
    updateMeasurementsReducer$(measurements$),
    resizeReducer$(actions.resizeAction$),
    startMultiplyReducer$(actions.startMultiplyAction$),
    nextStepReducer$(actions.nextStepAction$),
    fastForwardToEndReducer$(actions.endAction$),
    resetReducer$(actions.resetAction$),
    allowContinueReducer$(actions.allowContinueAction$),
  );
}
