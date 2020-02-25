import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import { Grid, Paper } from '@material-ui/core';
import FundTree from '../components/FundTree';

function AccountPage() {
  const [account, setAccount] = useState([]);
  const { id } = useParams();
  useDataRead('account', { id: parseInt(id) }, setAccount);
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
          Nothing yet... {JSON.stringify(account)}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountPage;
