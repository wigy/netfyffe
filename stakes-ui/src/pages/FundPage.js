import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import useStyles from '../styles';
import { Paper, Grid } from '@material-ui/core';
import FundTitle from '../components/FundTitle';

function FundPage() {
  const [fund, setFund] = useState([{}]);
  const [/* shares */, setShares] = useState([]);
  const classes = useStyles();

  const { id } = useParams();
  useDataRead('fund', { id: parseInt(id) }, setFund);
  useDataRead('shares', { fundId: parseInt(id) }, setShares);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <FundTitle fund={fund[0]} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
        Section 1
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={classes.paper}>
        Section 2
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FundPage;
/*
<div className="FundPage">
<h1>{fund[0].name}</h1>
<br />
{shares.map(share => (
  <div key={share.id}>
    <b>{share.date}  {share.amount} {share.investor.name}</b><br/>
    &nbsp;&nbsp;&nbsp;{share.transfer.from.account.fund.name} {share.transfer.from.account.name} {share.transfer.from.amount}<br />
    &nbsp;&nbsp;&nbsp;{share.transfer.to.account.fund.name} {share.transfer.to.account.name} {share.transfer.to.amount}<br />
    &nbsp;&nbsp;&nbsp;{JSON.stringify(share.transfer.comments.data)}<br />
  </div>
))}
</div>
*/
