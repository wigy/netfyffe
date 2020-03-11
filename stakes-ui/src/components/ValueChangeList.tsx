import React from 'react';
import { List } from '@material-ui/core';
import ValueChangeListItem from './ValueChangeListItem';
import { ValueChange } from '../types/index.d';

interface ValueChangeListProps {
  changes: ValueChange[];
}

function ValueChangeList(props: ValueChangeListProps): JSX.Element {
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

export default ValueChangeList;
