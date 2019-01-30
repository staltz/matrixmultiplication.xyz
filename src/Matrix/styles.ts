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
    $nest: {
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
    }
  });

  export const rightBracket = style({
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: matrixBracketWidth,
    backgroundColor: matrixBracketColor,
    $nest: {
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
    }
  });

  /**
   * Styles for the rows, columns, and cells.
   */

  const insetBoxShadow = {
    'box-shadow': 'inset 0px 1px 2px 0px rgba(0,0,0,0.5)',
  };

  export const row = style({
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  });

  export const cell = style({
    display: 'block',
    width: '48px',
    height: '48px',
    fontFamily: `'Source Sans Pro', sans-serif`,
    lineHeight: '49px',
    textAlign: 'center',
    border: 'none',
    textIndent: '0',
    padding: '0',
    color: pallete.black,
    backgroundColor: 'rgba(255,255,255,0)',
    $nest: {
      'input&': {
        $nest: {
          '&:hover': insetBoxShadow,
          '&:focus': insetBoxShadow,
        }
      } as any
    }
  });

  export const cellFontSize2 = 24;
  export const cellFontSize3 = 20;
  export const cellFontSize4 = 17;
  export const cellFontSize5 = 15;
  export const cellFontSize6 = 13;
  export const cellFontSize7 = 11;

  export const cell2 = style({fontSize: cellFontSize2 + 'px'});
  export const cell3 = style({fontSize: cellFontSize3 + 'px'});
  export const cell4 = style({fontSize: cellFontSize4 + 'px'});
  export const cell5 = style({fontSize: cellFontSize5 + 'px'});
  export const cell6 = style({fontSize: cellFontSize6 + 'px'});
  export const cell7 = style({fontSize: cellFontSize7 + 'px'});
};

export default Styles;