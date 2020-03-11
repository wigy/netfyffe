import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import { Grid, Paper, AppBar, Tab, Tabs } from '@material-ui/core';
import AccountTitle from '../components/AccountTitle';
import useStyles from '../styles';
import ValueChangeList from '../components/ValueChangeList';
import TabPanel from '../components/TabPanel';
import { Fund } from '../types/index.d';

interface AccountPageProps {
  funds: Fund[];
}

function AccountPage(props: AccountPageProps): JSX.Element {
  const [account, setAccount] = useState([{ fund: {}, service: {}, valueChanges: [] }]);
  const [tab, setTab] = useState(0);
  const classes = useStyles();
  const { id } = useParams();
  useDataRead('account', { id: parseInt(id) }, setAccount);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <AccountTitle account={account[0]}/>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Paper>
          <AppBar position="static">
            <Tabs value={tab} onChange={(_, newTab): void => setTab(newTab)}>
              <Tab label="Summary"/>
              <Tab label="Capital History"/>
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            TODO: Summary
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ValueChangeList changes={account[0].valueChanges} />
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountPage;
