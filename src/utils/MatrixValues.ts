import {List, fromJS} from 'immutable';

/**
 * An immutable data structure to hold the numbers in a matrix.
 */
export default class MatrixValues {
  private numRows: number;
  private numCols: number;
  public values: List<List<number | null>>;

  constructor() {
  }

  clone(): MatrixValues {
    const mv = new MatrixValues();
    mv.numRows = this.numRows;
    mv.numCols = this.numCols;
    mv.values = this.values;
    return mv;
  }

  static ofDimensions(rows: number, columns: number): MatrixValues {
    const mv = new MatrixValues();
    mv.numRows = Math.max(1, rows);
    mv.numCols = Math.max(1, columns);
    mv.values = makeValues(rows, columns);
    return mv;
  }

  static from(vals: Array<Array<number>>): MatrixValues {
    const mv = new MatrixValues();
    mv.numRows = vals.length;
    mv.numCols = vals[0].length;
    mv.values = fromJS(vals);
    return mv;
  }

  resize(numRows: number, numColumns: number): MatrixValues {
    const {numRows: oldNumRows, numCols: oldNumCols} = this;
    const nR = Math.max(1, numRows);
    const nC = Math.max(1, numColumns);

    // Make a new MatrixValues
    const mv = new MatrixValues();
    mv.numRows = nR;
    mv.numCols = nC;

    // Override the new values using the old MatrixValues
    mv.values = this.values
      .setSize(nR)
      .map((rows, rowIndex) => {
        if (rowIndex >= oldNumRows) {
          return makeRow(nC);
        } else {
          return (rows as List<number>).setSize(nC).map((v, colIndex) =>
            colIndex >= oldNumCols ? 1 : v
          );
        }
      }) as List<List<number>>;

    return mv;
  }

  set(rowIndex: number, colIndex: number, value: number): MatrixValues {
    const mv = this.clone();
    mv.values = mv.values.setIn([rowIndex, colIndex], value);
    return mv;
  }

  get(rowIndex: number, colIndex: number): number | null {
    return this.values.getIn([rowIndex, colIndex]);
  }

  setAll(value: number | null): MatrixValues {
    const mv = new MatrixValues();
    mv.numRows = this.numRows;
    mv.numCols = this.numCols;
    mv.values = makeValues(mv.numRows, mv.numCols, value);
    return mv;
  }

  get numberRows() {
    return this.numRows;
  }

  get numberColumns() {
    return this.numCols;
  }

  get rows(): Array<Array<number | null>> {
    return this.values.toJS();
  }
}

function makeValues(numRows: number, numColumns: number, val: number | null = 1): List<List<number | null>> {
  const vals = new Array<List<number | null>>(numRows);
  for (let i = 0; i < numRows; i++) {
    vals[i] = makeRow(numColumns, val);
  }
  return List(vals);
}

function makeRow(numColumns: number, val: number | null = 1): List<number | null> {
  const row = new Array<number | null>(numColumns);
  for (let i = 0; i < numColumns; i++) {
    row[i] = val;
  }
  return List(row);
}
