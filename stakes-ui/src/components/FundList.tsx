import React from 'react';
import { List } from '@material-ui/core';
import FundListItem from './FundListItem';
import { Fund } from '../types';

interface FundListProps {
  funds: Fund[];
}

function FundList(props: FundListProps): JSX.Element {
  const { funds } = props;

  return (
    <List>
      {
        funds.map((fund: Fund) => <FundListItem key={fund.id} fund={fund}/>)
      }
    </List>
  );
}

export default FundList;
