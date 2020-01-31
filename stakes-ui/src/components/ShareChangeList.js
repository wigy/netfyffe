import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';
import ShareChangeListItem from './ShareChangeListItem';

function ShareChangeList(props) {
  const { shares } = props;
  return <List>
    {shares.map((share, idx) => <ShareChangeListItem key={idx} share={share} />)}
  </List>;
}

ShareChangeList.propTypes = {
  shares: PropTypes.arrayOf(PropTypes.object)
};

export default ShareChangeList;
