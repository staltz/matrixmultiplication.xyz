import {style} from 'typestyle';
import {pallete} from '../styles';

namespace Styles {
  /**
   * Constants for sizes and colors.
   */

  export const matrixBracketWidth = 2;
  export const matrixBracketWidthPx = `${matrixBracketWidth}px`;
  export const matrixBracketIngress = '9px';
  export const matrixBracketColor = pallete.black;

  /**
   * Styles for the matrix and its brackets.
   */

  export const matrix = style({
    position: 'relative',
    padding: matrixBracketWidth,
  });

  export const leftBracket = style({
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    width: matrixBracketWidth,
    backgroundColor: matrixBracketColor,
    '&::before': {
      content: `''`,
      backgroundColor: matrixBracketColor,
      position: 'absolute',
      top: 0,
      left: 0,
      height: matrixBracketWidth,
      width: matrixBracketIngress,
    },
    '&::after': {
      content: `''`,
      backgroundColor: matrixBracketColor,
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: matrixBracketWidth,
      width: matrixBracketIngress,
    },
  });

  export const rightBracket = style({
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: matrixBracketWidth,
    backgroundColor: matrixBracketColor,
    '&::before': {
      content: `''`,
      backgroundColor: matrixBracketColor,
      position: 'absolute',
      top: 0,
      right: 0,
      height: matrixBracketWidth,
      width: matrixBracketIngress,
    },
    '&::after': {
      content: `''`,
      backgroundColor: matrixBracketColor,
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: matrixBracketWidth,
      width: matrixBracketIngress,
    },
  });

  /**
   * Styles for the rows, columns, and cells.
   */

  const insetBoxShadow = {
    'box-shadow': 'inset 0px 1px 2px 0px rgba(0,0,0,0.5)',
  };

  export const row = style({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
  });

  export const cell = style({
    display: 'inline-block',
    fontSize: '24px',
    width: '2em',
    height: '2em',
    fontFamily: `'Source Sans Pro', sans-serif`,
    lineHeight: '49px',
    textAlign: 'center',
    border: 'none',
    textIndent: '0',
    padding: '0',
    color: pallete.black,
    backgroundColor: 'rgba(255,255,255,0)',
    'input&': {
      '&:hover': insetBoxShadow,
      '&:focus': insetBoxShadow,
    },
  });
};

export default Styles;