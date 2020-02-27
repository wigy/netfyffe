import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import { Grid, Paper } from '@material-ui/core';
import FundTree from '../components/FundTree';
import AccountTitle from '../components/AccountTitle';
import useStyles from '../styles';
import ValueChangeList from '../components/ValueChangeList';

function AccountPage() {
  const [account, setAccount] = useState([{ fund: {}, service: {}, valueChanges: [] }]);
  const classes = useStyles();
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
      <Grid item xs={12} md={6} lg={8}>
        <Paper className={classes.paper}>
          <AccountTitle account={account[0]}/>
        </Paper>
        <Paper>
          <ValueChangeList changes={account[0].valueChanges} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountPage;
