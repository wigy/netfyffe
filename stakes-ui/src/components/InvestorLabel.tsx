import React from 'react';
import TagImage from './TagImage';
import { Typography, Grid } from '@material-ui/core';
import { Investor } from '../types';

interface InvestorLabelProps {
  align: string;
  investor: Investor;
  text: string;
}

function InvestorLabel(props: InvestorLabelProps): JSX.Element {
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
