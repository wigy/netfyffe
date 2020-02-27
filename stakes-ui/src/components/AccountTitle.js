import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import useStyles from '../styles';

function AccountTitle(props) {
  const { account } = props;
  const classes = useStyles();
  return <Box>
    <TagImage tag={account.fund.tag} />
    <TagImage tag={account.service.tag} />
    <Typography className={classes.title} color="primary" variant="h3" display="inline">{account.number} {account.name}</Typography>
  </Box>;
}

AccountTitle.propTypes = {
  account: PropTypes.object
};

export default AccountTitle;
