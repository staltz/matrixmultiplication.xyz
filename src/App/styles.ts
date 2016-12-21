import {style, cssRule} from 'typestyle';
import {pallete} from '../styles';

cssRule('body', {
  margin: 0,
  color: pallete.black,
  fontFamily: '"Source Sans Pro", serif',
  fontWeight: 400,
});

namespace Styles {
  export const title = style({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    fontFamily: '"Vesper Libre", serif',
    fontWeight: 400,
    textAlign: 'center',
    margin: 0,
    paddingTop: '1.5rem',
    paddingBottom: '3rem',
    zIndex: 10,
    backgroundImage:
      'linear-gradient(to bottom, ' +
        'white 0, ' +
        'rgba(255,255,255,0.9) 60%, ' +
        'rgba(255,255,255,0) 100%)',
  });

  export const footnote = style({
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    fontFamily: '"Source Sans Pro", serif',
    fontSize: '14px',
    textAlign: 'center',
    zIndex: -10,
    '& > *': {
      color: pallete.gray,
    },
  });
};

export default Styles;