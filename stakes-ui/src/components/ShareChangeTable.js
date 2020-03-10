import React from 'react';
import PropTypes from 'prop-types';
import { Paper, TableFooter } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InvestorLabel from './InvestorLabel';
import moment from 'moment';
import Amount from './Amount';
import ShareChange from './ShareChange';
import Percent from './Percent';

function ShareChangeTable(props) {
  const { shares, cashOnly } = props;
  const byDate = {};
  const investorsById = {};
  const total = {};

  shares.forEach(share => {
    const { transfer, investor } = share;
    investorsById[investor.id] = investor;

    byDate[share.date] = byDate[share.date] || {};
    byDate[share.date][investor.id] = byDate[share.date][investor.id] || [];
    byDate[share.date][investor.id].push({
      amount: share.amount,
      transfer
    });

    total[investor.id] = (total[investor.id] || 0) + share.amount;
  });

  const investors = Object.values(investorsById);
  const sum = Object.values(total).reduce((prev, cur) => prev + cur, 0);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {investors.map(i => (
              <TableCell align="right" key={i.id}>
                <InvestorLabel align="right" investor={i} text={<Percent amount={total[i.id] / sum}/> }/>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(byDate).map(date => (
            <TableRow key={date}>
              <TableCell>{moment(date).format('LL')}</TableCell>
              {investors.map(i => (
                <TableCell align="right" key={i.id}>
                  {byDate[date][i.id] && byDate[date][i.id].map((entry, idx) => (
                    <div key={idx}>
                      <ShareChange cashOnly={cashOnly} amount={entry.amount} transfer={entry.transfer}/>
                    </div>
                  ))
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            {investors.map(i => (
              <TableCell align="right" key={i.id}>
                <b><Amount amount={total[i.id]} decimals={4}/></b>
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

ShareChangeTable.propTypes = {
  cashOnly: PropTypes.bool,
  shares: PropTypes.arrayOf(PropTypes.object)
};

export default ShareChangeTable;
