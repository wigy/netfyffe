import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

function FundTitle(props) {
  const { fund } = props;
  return <Box>
    <TagImage tag={fund.tag} />
    <Typography color="primary" variant="h1" display="inline">{fund.name}</Typography>
  </Box>;
}

FundTitle.propTypes = {
  fund: PropTypes.object
};

export default FundTitle;
