import React from 'react';
import { PropTypes } from 'prop-types';
import TagImage from './TagImage';
import { Typography, Grid } from '@material-ui/core';

function InvestorLabel(props) {
  const { investor, text, align } = props;
  return <Grid container justify={align === 'right' ? 'flex-end' : 'flex-start'} alignItems="center" spacing={2}>
    <Grid item>
      <TagImage avatar tag={investor.tag} />
    </Grid>
    <Grid item>
      <Typography variant="subtitle1">{investor.name}</Typography>
      {text !== undefined && <Typography variant="subtitle2">{text}</Typography>}
    </Grid>
  </Grid>;
}

export default InvestorLabel;

InvestorLabel.propTypes = {
  align: PropTypes.string,
  investor: PropTypes.object,
  text: PropTypes.any
};
