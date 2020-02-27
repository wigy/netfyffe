import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import useStyles from '../styles';

function FundTitle(props) {
  const { fund } = props;
  const classes = useStyles();
  return <Box>
    <TagImage tag={fund.tag} />
    <Typography className={classes.title} color="primary" variant="h1" display="inline">{fund.name}</Typography>
  </Box>;
}

FundTitle.propTypes = {
  fund: PropTypes.object
};

export default FundTitle;
