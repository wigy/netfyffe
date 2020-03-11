import React from 'react';
import TagImage from './TagImage';
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
import useStyles from '../styles';
import { Fund } from '../types/index.d';

interface FundTitleProps {
  fund: Fund;
}

function FundTitle(props: FundTitleProps): JSX.Element {
  const { fund } = props;
  const classes = useStyles();
  return <Grid container className={classes.title} justify="space-between">
    <Grid>
      <Typography color="primary" variant="h1" display="inline">{fund.name}</Typography>
    </Grid>
    <Grid>
      <TagImage tag={fund.tag} />
    </Grid>
  </Grid>;
}

FundTitle.propTypes = {
  fund: PropTypes.object
};

export default FundTitle;
