import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import useStyles from '../styles';
import { Paper, Grid, AppBar, Tabs, Tab } from '@material-ui/core';
import FundTitle from '../components/FundTitle';
import ShareChangeTable from '../components/ShareChangeTable';
import TabPanel from '../components/TabPanel';
import FundSummary from '../components/FundSummary';
import { InvestorMap, Fund } from '../types/index.d';

function FundPage(): JSX.Element {
  const [fund, setFund] = useState([{} as Fund]);
  const [shares, setShares] = useState([]);
  const [tab, setTab] = useState(0);
  const classes = useStyles();

  const { id } = useParams();
  useDataRead('fund', { id: parseInt(id) }, setFund);
  useDataRead('shares', { fundId: parseInt(id) }, setShares);

  const investors: InvestorMap = {};
  shares.forEach(share => {
    investors[share.investor.id] = investors[share.investor.id] || share.investor;
    investors[share.investor.id].shares = (investors[share.investor.id].shares || 0) + share.amount;
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <FundTitle fund={fund[0]} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Paper>
          <AppBar position="static">
            <Tabs value={tab} onChange={(_, newTab): void => setTab(newTab)}>
              <Tab label="Summary"/>
              <Tab label="Shares"/>
              <Tab label="Value History"/>
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <FundSummary fund={fund[0]} shares={shares} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ShareChangeTable cashOnly={fund[0].name === 'Cash'} shares={shares} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
          TODO: Value history.
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FundPage;
