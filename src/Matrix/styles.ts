import {style} from 'typestyle';

const insetBoxShadow = {
  'box-shadow': 'inset 0px 1px 2px 0px rgba(0,0,0,0.5)',
};

const matrixBorderWidth = '2px';
const matrixBorderIngress = '9px';
const matrixBorderColor = 'black';

export default {
  matrix: style({
    position: 'relative',
    padding: matrixBorderWidth,
  }),

  leftBracket: style({
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    width: matrixBorderWidth,
    backgroundColor: matrixBorderColor,
    '&::before': {
      content: `''`,
      backgroundColor: matrixBorderColor,
      position: 'absolute',
      top: 0,
      left: 0,
      height: matrixBorderWidth,
      width: matrixBorderIngress,
    },
    '&::after': {
      content: `''`,
      backgroundColor: matrixBorderColor,
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: matrixBorderWidth,
      width: matrixBorderIngress,
    },
  }),

  rightBracket: style({
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: matrixBorderWidth,
    backgroundColor: matrixBorderColor,
    '&::before': {
      content: `''`,
      backgroundColor: matrixBorderColor,
      position: 'absolute',
      top: 0,
      right: 0,
      height: matrixBorderWidth,
      width: matrixBorderIngress,
    },
    '&::after': {
      content: `''`,
      backgroundColor: matrixBorderColor,
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: matrixBorderWidth,
      width: matrixBorderIngress,
    },
  }),

  row: style({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
  }),

  cell: style({
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
    backgroundColor: 'transparent',
    'input&': {
      '&:hover': insetBoxShadow,
      '&:focus': insetBoxShadow,
    },
  }),
};