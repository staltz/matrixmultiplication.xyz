import {style, keyframes} from 'typestyle';

const hideAnimation = keyframes({
  from: {opacity: 1},
  to: {opacity: 0},
});

export default {
  calculator: style({
    marginTop: '200px',
    marginBottom: '100px',
  }),

  matrices: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  controlPanel: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '86px',
  }),

  multiplyButton: style({
    boxShadow: '0 1px 1px 0 #c5c5c5',
    backgroundColor: 'rgba(48, 141, 255, 1)',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    padding: '8px 16px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(48, 141, 255, 0.8)',
    },
  }),

  multiplyButtonDisabled: style({
    backgroundColor: '#c5c5c5',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    padding: '8px 16px',
  }),

  multiplyButtonHidden: style({
    display: 'none',
  }),

  multiplySign: style({
    margin: '1em',
    fontSize: '24px',
    color: '#686868',
  }),

  disappear: style({
    animationName: hideAnimation,
    animationDuration: '0.5s',
  }),

  rowsResizer: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 10px',
  }),

  colsResizerContainer: style({
    position: 'relative',
  }),

  colsResizer: style({
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '10px 0',
  }),

  resizerButton: style({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxShadow: '0 1px 1px 0 #c5c5c5',
    color: '#686868',
    border: 'none',
    fontSize: '20px',
    textAlign: 'center',
    width: '30px',
    height: '30px',
    lineHeight: '30px',
    margin: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  }),
};
