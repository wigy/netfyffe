import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
import useStyles from '../styles';

function AccountTitle(props) {
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

AccountTitle.propTypes = {
  account: PropTypes.object
};

export default AccountTitle;
