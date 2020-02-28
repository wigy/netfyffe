import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import { Grid, Paper } from '@material-ui/core';
import AccountTitle from '../components/AccountTitle';
import useStyles from '../styles';
import ValueChangeList from '../components/ValueChangeList';

function AccountPage() {
  const [account, setAccount] = useState([{ fund: {}, service: {}, valueChanges: [] }]);
  const classes = useStyles();
  const { id } = useParams();
  useDataRead('account', { id: parseInt(id) }, setAccount);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
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
