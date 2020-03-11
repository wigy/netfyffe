import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import useStyles from '../styles';

function DashboardPage(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={classes.paper}>
          Section 1
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
        Section 2
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
        Section 3
        </Paper>
      </Grid>
    </Grid>
  );
}

export default withTheme(DashboardPage);
