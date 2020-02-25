import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { Paper, Grid } from '@material-ui/core';
import FundTree from '../components/FundTree';

function AccountsPage() {
  const [funds, setFunds] = useState([]);
  useDataRead('funds', setFunds);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper>
          <FundTree funds={funds}/>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={5}>
        <Paper>
          Nothing yet...
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountsPage;
