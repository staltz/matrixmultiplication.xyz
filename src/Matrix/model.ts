import xs, {Stream, MemoryStream} from 'xstream';
import MatrixValues from '../utils/MatrixValues';

export interface State {
  values: MatrixValues;
  editable: boolean;
  id: string;
}

export type Reducer = (state: State) => State;

export interface Action {
  row: number;
  col: number;
  val: number;
}

const defaultState: State = {
  values: MatrixValues.ofDimensions(1, 1),
  editable: true,
  id: `matrix${Math.round(Math.random()*1000)}`,
};

/**
 * Controls modifications to state, through the emission of reducer functions.
 */
export default function model(action$: Stream<Action>): Stream<Reducer> {
  const initReducer$ = xs.of(function initReducer(prevState: State): State {
    if (!prevState) {
      return defaultState;
    } else {
      return prevState;
    }
  });

  const inputReducer$ = action$
    .map(action => function inputReducer(prevState: State): State {
      return {
        values: prevState.values.set(action.row, action.col, action.val),
        editable: prevState.editable,
        id: prevState.id,
      };
    });

  return xs.merge(initReducer$, inputReducer$);
}