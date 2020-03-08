import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple, red, green, lightGreen, yellow, pink, indigo } from '@material-ui/core/colors';

const drawerWidth = 400;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  // Toolbar.
  toolbar: {
    paddingRight: 24
  },
  toolBarButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: 240,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarSpacer: theme.mixins.toolbar,
  menuButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(4)
  },
  // Drawer.
  drawer: {
    width: drawerWidth - 1,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX: 'hidden'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    fontFamily: theme.typography.h4.fontFamily,
    fontWeight: theme.typography.h4.fontWeight,
    fontSize: theme.typography.h4.fontSize,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textShadow: '2px 2px black',
    boxShadow: theme.shadows[3]
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  // General containers.
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  // Colors.
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500]
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500]
  },
  lightGreen: {
    color: theme.palette.getContrastText(lightGreen[500]),
    backgroundColor: lightGreen[500]
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500]
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500]
  },
  yellow: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500]
  },
  indigo: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500]
  },
  // Miscellaneous.
  title: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

export default useStyles;
