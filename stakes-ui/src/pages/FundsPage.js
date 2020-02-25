import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { Grid, Paper } from '@material-ui/core';

function FundsPage() {
  const [, setFunds] = useState([]);
  useDataRead('funds', setFunds);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper>
          Nothing yet...
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={5}>
        <Paper>
          Nothing yet...
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FundsPage;
