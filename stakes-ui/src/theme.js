import { createMuiTheme } from '@material-ui/core/styles';
import { teal, yellow, blueGrey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: yellow,
    background: {
      default: blueGrey[100]
    }
  }
});

export default theme;
