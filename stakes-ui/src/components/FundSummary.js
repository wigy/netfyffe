import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import useStyles from '../styles';
import { Pie } from 'react-chartjs-2';

function FundSummary(props) {
  const { /* fund, */ shares } = props;
  const classes = useStyles();

  let total = 0;
  const sharesById = {};
  const investorsById = {};

  shares.forEach(share => {
    total += share.amount;
    const investorId = share.investor.id;
    sharesById[investorId] = (sharesById[investorId] || 0) + share.amount;
    if (!investorsById[investorId]) {
      investorsById[investorId] = share.investor;
    }
  });

  const data = Object.keys(sharesById).map(id => ({
    id,
    name: investorsById[id].name,
    color: investorsById[id].color,
    shares: sharesById[id],
    percentage: Math.round(1000 * sharesById[id] / total) / 10
  }));

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={6}>
          Stats
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
          <Pie
            data={{
              labels: data.map(e => e.name),
              datasets: [
                {
                  data: data.map(e => e.percentage),
                  backgroundColor: data.map(e => `rgba(${e.color},0.3)`),
                  borderColor: data.map(e => `rgba(${e.color},1)`),
                  borderWidth: 1
                }
              ]
            }}
            options={{
              title: {
                display: true,
                text: 'Shares per investor',
                fontFamily: '"Times New Roman", Georgia, Serif',
                fontSize: 18
              },
              tooltips: {
                bodyFontFamily: '"Times New Roman", Georgia, Serif',
                callbacks: {
                  label: function(tooltipItem, data) {
                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    const label = `${data.labels[tooltipItem.index]} ${value}%`;
                    return label;
                  }
                }
              },
              legend: {
                position: 'bottom'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
          Something else
        </Grid>
      </Grid>
    </Paper>
  );
}

FundSummary.propTypes = {
  fund: PropTypes.object.isRequired,
  shares: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FundSummary;
