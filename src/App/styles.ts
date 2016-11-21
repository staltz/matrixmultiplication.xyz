import {style, cssRule} from 'typestyle';

cssRule('body', {
  margin: 0,
  fontFamily: '"Source Sans Pro", serif',
  fontWeight: 400,
});

export default {
  title: style({
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
        'transparent 100%)',
  }),
};