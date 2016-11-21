import {List} from 'immutable';

/**
 * An immutable data structure to hold the numbers in a matrix.
 */
export default class MatrixValues {
  private numRows: number;
  private numCols: number;
  public values: List<List<number>>;

  constructor() {
  }

  clone(): MatrixValues {
    let mv = new MatrixValues();
    mv.numRows = this.numRows;
    mv.numCols = this.numCols;
    mv.values = this.values;
    return mv;
  }

  static ofDimensions(rows: number, columns: number): MatrixValues {
    let mv = new MatrixValues();
    mv.numRows = Math.max(1, rows);
    mv.numCols = Math.max(1, columns);
    mv.values = makeValues(rows, columns);
    return mv;
  }

  resize(numRows: number, numColumns: number): MatrixValues {
    let {numRows: oldNumRows, numCols: oldNumCols} = this;
    let nR = Math.max(1, numRows);
    let nC = Math.max(1, numColumns);

    // Make a new MatrixValues
    let mv = new MatrixValues();
    mv.numRows = nR;
    mv.numCols = nC;

    // Override the new values using the old MatrixValues
    mv.values = <List<List<number>>>this.values
      .setSize(nR)
      .map((rows, rowIndex) => {
        if (rowIndex >= oldNumRows) {
          return makeRow(nC);
        } else {
          return (rows as List<number>).setSize(nC).map((v, colIndex) =>
            colIndex >= oldNumCols ? 1 : v
          );
        }
      });

    return mv;
  }

  set(rowIndex: number, colIndex: number, value: number): MatrixValues {
    let mv = this.clone();
    mv.values = mv.values.setIn([rowIndex, colIndex], value);
    return mv;
  }

  get numberRows() {
    return this.numRows;
  }

  get numberColumns() {
    return this.numCols;
  }

  get rows(): Array<Array<number>> {
    return this.values.toJS();
  }
}

function makeValues(numRows: number, numColumns: number): List<List<number>> {
  let vals = new Array<List<number>>(numRows);
  for (let i = 0; i < numRows; i++) {
    vals[i] = makeRow(numColumns);
  }
  return List(vals);
}

function makeRow(numColumns: number): List<number> {
  let row = new Array<number>(numColumns);
  for (let i = 0; i < numColumns; i++) {
    row[i] = 1;
  }
  return List(row);
}
