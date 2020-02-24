import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import useStyles from '../styles';
import { Paper, Grid } from '@material-ui/core';
import FundTitle from '../components/FundTitle';
import ShareChangeTable from '../components/ShareChangeTable';

function FundPage() {
  const [/* fund */, setFund] = useState([{}]);
  const [shares, setShares] = useState([]);
  const classes = useStyles();

  const { id } = useParams();
  useDataRead('fund', { id: parseInt(id) }, setFund);
  useDataRead('shares', { fundId: parseInt(id) }, setShares);

  const investors = {};
  shares.forEach(share => {
    investors[share.investor.id] = investors[share.investor.id] || share.investor;
    investors[share.investor.id].shares = (investors[share.investor.id].shares || 0) + share.amount;
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <FundTitle fund={{} /* fund[0] */} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <ShareChangeTable shares={shares} />
      </Grid>
    </Grid>
  );
}

export default FundPage;
