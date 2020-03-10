import { createMuiTheme } from '@material-ui/core/styles';
import { teal, yellow, blueGrey } from '@material-ui/core/colors';
import 'typeface-playfair-display';
import 'typeface-barlow-semi-condensed';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: yellow,
    background: {
      default: blueGrey[100]
    }
  },
  typography: {
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    subtitle1: {
      fontFamily: '"Barlow Semi Condensed", sans-serif'
    },
    subtitle2: {
      fontFamily: '"Barlow Semi Condensed", sans-serif'
    },
    body1: {
      fontFamily: '"Barlow Semi Condensed", sans-serif'
    },
    body2: {
      fontFamily: '"Barlow Semi Condensed", sans-serif'
    },
    button: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold'
    },
    caption: {
      fontFamily: '"Playfair Display", serif'
    },
    overline: {
      fontFamily: '"Barlow Semi Condensed", sans-serif'
    }
  }
});

export default theme;
