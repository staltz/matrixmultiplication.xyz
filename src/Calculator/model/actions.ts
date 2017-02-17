import {MatrixID} from './index';

/**
 * This file defines "actions", which are events which may affect the state.
 */

export type Direction = 'row' | 'column';

export interface ResizeAction {
  target: MatrixID;
  resizeParam: {
    direction: Direction;
    amount: number;
  };
}
