import React from 'react';
import { List } from '@material-ui/core';
import FundListItem from './FundListItem';
import { PropTypes } from 'prop-types';

function FundList(props) {
  const { funds } = props;

  return (
    <List>
      {
        funds.map(fund => <FundListItem key={fund.id} fund={fund}/>)
      }
    </List>
  );
}

FundList.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object)
};

export default FundList;
