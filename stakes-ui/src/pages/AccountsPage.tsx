import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { Fund } from '../types/index.d';

interface AccountsPageProps {
  funds: Fund[];
}

function AccountsPage(props: AccountsPageProps): JSX.Element {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper>
          Nothing yet...
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountsPage;
