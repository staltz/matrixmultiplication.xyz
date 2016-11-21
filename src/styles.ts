import {cssRule} from 'typestyle';

cssRule('@font-face', {
  fontFamily: '"Source Sans Pro"',
  src: 'url("./fonts/SourceSansPro-Regular.otf")',
  fontWeight: 'normal',
});

cssRule('@font-face', {
  fontFamily: '"Vesper Libre"',
  src: 'url("./fonts/VesperLibre-Regular.ttf")',
  fontWeight: 'normal',
});

export const pallete = {
  blue: 'rgba(48, 141, 255, 1)',
  blueWeak: 'rgba(48, 141, 255, 0.8)',
  orange: 'rgba(255, 162, 48, 1)',
  orangeWeak: 'rgba(255, 162, 48, 0.8)',
  // grayscale
  white:     '#FFFFFF',
  grayLight: '#EEEEEE',
  gray:      '#C5C5C5',
  grayDark:  '#686868',
  black:     '#323232',
};