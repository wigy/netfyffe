import React from 'react';
import { List } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import ValueChangeListItem from './ValueChangeListItem';

function ValueChangeList(props) {
  const { changes } = props;
  return (
    <List>
      {
        changes.map(change => (
          <ValueChangeListItem key={change.id} change={change} />
        ))
      }
    </List>
  );
}

ValueChangeList.propTypes = {
  changes: PropTypes.arrayOf(PropTypes.object)
};

export default ValueChangeList;
