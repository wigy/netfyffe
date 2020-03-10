import React from 'react';
import { Typography } from '@material-ui/core';

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a target="_new" href="https://www.linkedin.com/in/wigys/">
        Tommi Ronkainen
      </a>{' '}
      2020
      {'.'}
    </Typography>
  );
}

export default Copyright;
