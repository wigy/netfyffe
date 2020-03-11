import React from 'react';
import TagImage from './TagImage';
import { Typography, Grid } from '@material-ui/core';
import useStyles from '../styles';
import { Account } from '../types/index.d';

interface AccountTitleProps {
  account: Account;
}

function AccountTitle(props: AccountTitleProps): JSX.Element {
  const { account } = props;
  const classes = useStyles();
  return <Grid className={classes.title} container justify="space-between">
    <Grid>
      <Typography color="primary" variant="h3" display="inline">{account.number}<br/>{account.name}</Typography>
    </Grid>
    <Grid>
      <TagImage tag={account.fund.tag} />
      <TagImage tag={account.service.tag} />
    </Grid>
  </Grid>;
}

export default AccountTitle;
