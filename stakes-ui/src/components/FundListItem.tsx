import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import TagImage from './TagImage';
import { useHistory } from 'react-router-dom';
import { Fund } from '../types/index.d';

interface FundListItemProps {
  fund: Fund;
}

function FundListItem(props: FundListItemProps): JSX.Element {
  const { fund } = props;
  const history = useHistory();

  return (
    <ListItem button onClick={(): void => history.push(`/funds/${fund.id}`)}>
      <ListItemIcon>
        <TagImage tag={fund.tag} medium />
      </ListItemIcon>
      <ListItemText primary={fund.name} secondary="Text needed"/>
    </ListItem>
  );
}

export default FundListItem;
