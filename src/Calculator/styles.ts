import styles from '../styles';

const hideAnimation = styles.registerKeyframes({
  from: {opacity: 1},
  to: {opacity: 0},
});

export default {
  calculator: styles.registerStyle({
    'margin-top': '200px',
    'margin-bottom': '100px',
  }),

  matrices: styles.registerStyle({
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
  }),

  controlPanel: styles.registerStyle({
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'margin-top': '86px',
  }),

  multiplyButton: styles.registerStyle({
    'box-shadow': '0 1px 1px 0 #c5c5c5',
    'background-color': 'rgba(48, 141, 255, 1)',
    'color': 'white',
    'border': 'none',
    'font-size': '24px',
    'padding': '8px 16px',
    'cursor': 'pointer',
    '&:hover': {
      'background-color': 'rgba(48, 141, 255, 0.8)',
    },
  }),

  multiplyButtonDisabled: styles.registerStyle({
    'background-color': '#c5c5c5',
    'color': 'white',
    'border': 'none',
    'font-size': '24px',
    'padding': '8px 16px',
  }),

  multiplyButtonHidden: styles.registerStyle({
    'display': 'none',
  }),

  multiplySign: styles.registerStyle({
    'margin': '1em',
    'font-size': '24px',
    'color': '#686868',
  }),

  disappear: styles.registerStyle({
    'animation-name': hideAnimation,
    'animation-duration': '0.5s',
  }),

  rowsResizer: styles.registerStyle({
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'margin': '0 10px',
  }),

  colsResizerContainer: styles.registerStyle({
    'position': 'relative',
  }),

  colsResizer: styles.registerStyle({
    'position': 'absolute',
    'left': 0,
    'right': 0,
    'display': 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    'margin': '10px 0',
  }),

  resizerButton: styles.registerStyle({
    'background-color': 'rgba(0, 0, 0, 0)',
    'box-shadow': '0 1px 1px 0 #c5c5c5',
    'color': '#686868',
    'border': 'none',
    'font-size': '20px',
    'text-align': 'center',
    'width': '30px',
    'height': '30px',
    'line-height': '30px',
    'margin': '4px',
    'cursor': 'pointer',
    '&:hover': {
      'background-color': 'rgba(0, 0, 0, 0.08)',
    },
  }),
};
