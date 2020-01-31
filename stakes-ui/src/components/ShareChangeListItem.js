import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import TagImage from './TagImage';
import Amount from './Amount';

function ShareChangeListItem(props) {
  const { amount, date, investor } = props.share;
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <TagImage avatar tag={investor.tag} />
      </ListItemAvatar>
      <ListItemText
        primary={<span><Amount signed amount={amount} decimals={4}/></span>}
        secondary={moment(date).format('LL')}
      />
    </ListItem>
  );
}

ShareChangeListItem.propTypes = {
  share: PropTypes.object
};

export default ShareChangeListItem;
