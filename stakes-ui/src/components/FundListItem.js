import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import TagImage from './TagImage';
import { useHistory } from 'react-router-dom';

function FundListItem(props) {
  const { fund } = props;
  const history = useHistory();

  return (
    <ListItem button onClick={() => history.push(`/funds/${fund.id}`)}>
      <ListItemIcon>
        <TagImage tag={fund.tag} medium />
      </ListItemIcon>
      <ListItemText primary={fund.name} secondary="Text needed"/>
    </ListItem>
  );
}

FundListItem.propTypes = {
  fund: PropTypes.object.isRequired
};

export default FundListItem;
