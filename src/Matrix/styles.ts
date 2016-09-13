import styles from '../styles';

const insetBoxShadow = {
  'box-shadow': 'inset 0px 1px 2px 0px rgba(0,0,0,0.5)',
};

const matrixBorderWidth = '2px';
const matrixBorderIngress = '9px';
const matrixBorderColor = 'black';

export default {
  matrix: styles.registerStyle({
    'position': 'relative',
    'padding': matrixBorderWidth,
  }),

  leftBracket: styles.registerStyle({
    'position': 'absolute',
    'left': 0,
    'bottom': 0,
    'top': 0,
    'width': matrixBorderWidth,
    'background-color': matrixBorderColor,
    '&::before': {
      'content': `''`,
      'background-color': matrixBorderColor,
      'position': 'absolute',
      'top': 0,
      'left': 0,
      'height': matrixBorderWidth,
      'width': matrixBorderIngress,
    },
    '&::after': {
      'content': `''`,
      'background-color': matrixBorderColor,
      'position': 'absolute',
      'bottom': 0,
      'left': 0,
      'height': matrixBorderWidth,
      'width': matrixBorderIngress,
    },
  }),

  rightBracket: styles.registerStyle({
    'position': 'absolute',
    'right': 0,
    'bottom': 0,
    'top': 0,
    'width': matrixBorderWidth,
    'background-color': matrixBorderColor,
    '&::before': {
      'content': `''`,
      'background-color': matrixBorderColor,
      'position': 'absolute',
      'top': 0,
      'right': 0,
      'height': matrixBorderWidth,
      'width': matrixBorderIngress,
    },
    '&::after': {
      'content': `''`,
      'background-color': matrixBorderColor,
      'position': 'absolute',
      'bottom': 0,
      'right': 0,
      'height': matrixBorderWidth,
      'width': matrixBorderIngress,
    },
  }),

  row: styles.registerStyle({
    'list-style-type': 'none',
    'padding': '0',
    'margin': '0',
    'display': 'flex',
  }),

  cell: styles.registerStyle({
    'display': 'inline-block',
    'font-size': '24px',
    'width': '2em',
    'height': '2em',
    'font-family': `'Source Sans Pro', sans-serif`,
    'line-height': '49px',
    'text-align': 'center',
    'border': 'none',
    'text-indent': '0',
    'padding': '0',
    'background-color': 'transparent',
    'input&': {
      '&:hover': insetBoxShadow,
      '&:focus': insetBoxShadow,
    },
  }),
};