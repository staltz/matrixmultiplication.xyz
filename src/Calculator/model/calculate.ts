import MatrixValues from '../../utils/MatrixValues';

function calculateCellMatrixC(i: number,
                              j: number,
                              matrixA: MatrixValues,
                              matrixB: MatrixValues): number {
  const m = matrixA.numberColumns;
  let acc = 0;
  for (let k = 0; k < m; k++) {
    acc += (matrixA.get(i, k) || 1) * (matrixB.get(k, j) || 1)
  }
  return acc;
}

/**
 * Performs the actual matrix multiplication calculation.
 * However, it does so in steps. Provided `nextStep`, it will
 * compute the corresponding cell values in `matrixC`.
 */
export function calculateNextMatrixC(nextStep: number,
                                     matrixA: MatrixValues,
                                     matrixB: MatrixValues,
                                     matrixC: MatrixValues): MatrixValues {
  let newMatrixC = matrixC;
  matrixC.rows.forEach((row, i) => {
    row.forEach((cellC, j) => {
      if (i + j === nextStep - 2) {
        const val = calculateCellMatrixC(i, j, matrixA, matrixB);
        newMatrixC = newMatrixC.set(i, j, val);
      }
    });
  });
  return newMatrixC;
}
