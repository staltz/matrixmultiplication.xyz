import {style, keyframes} from 'typestyle';
import MatrixStyles from '../Matrix/styles';
import {pallete} from '../styles';

namespace Styles {
  export const matrixBracketWidth = MatrixStyles.matrixBracketWidth;

  export const hideAnimation = keyframes({
    from: {opacity: 1},
    to: {opacity: 0},
  });

  export const calculator = style({
    marginTop: '200px',
    marginBottom: '100px',
  });

  export const matrices = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  export const controlPanel = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '86px',
  });

  const multiplyButtonCommon: NestedCSSProperties = {
    color: pallete.white,
    border: 'none',
    fontSize: '24px',
    padding: '8px 16px',
  };

  export const multiplyButton = style(multiplyButtonCommon, {
    boxShadow: `0 1px 1px 0 ${pallete.gray}`,
    backgroundColor: pallete.blue,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: pallete.blueWeak,
    },
  });

  export const multiplyButtonDisabled = style(multiplyButtonCommon, {
    backgroundColor: pallete.gray,
  });

  export const multiplyButtonHidden = style({
    display: 'none',
  });

  export const multiplySign = style({
    margin: '1em',
    fontSize: '24px',
    color: pallete.grayDark,
  });

  export const disappear = style({
    animationName: hideAnimation,
    animationDuration: '0.5s',
  });

  export const rowsResizer = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 10px',
  });

  export const colsResizerContainer = style({
    position: 'relative',
  });

  export const colsResizer = style({
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '10px 0',
  });

  export const resizerButton = style({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    boxShadow: `0 1px 1px 0 ${pallete.gray}`,
    color: pallete.grayDark,
    border: 'none',
    fontSize: '20px',
    textAlign: 'center',
    width: '30px',
    height: '30px',
    lineHeight: '30px',
    margin: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: pallete.grayLight,
    },
  });
};

export default Styles;