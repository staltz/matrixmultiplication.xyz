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
  blue: 'rgb(48, 141, 255)',
  blueWeak: 'rgb(93, 166, 252)',
  orange: 'rgb(255, 162, 48)',
  orangeWeak: 'rgb(253, 180, 97)',
  // grayscale
  white:     '#FFFFFF',
  grayLight: '#EEEEEE',
  gray:      '#C5C5C5',
  grayDark:  '#686868',
  black:     '#323232',
};