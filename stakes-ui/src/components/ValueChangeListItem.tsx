import React from 'react';
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import Amount from './Amount';
import TransferImage from './TransferImage';
import moment from 'moment';
import { ValueChange } from '../types/index.d';

interface ValueChangeListItemProps {
  change: ValueChange;
}

function ValueChangeListItem(props: ValueChangeListItemProps): JSX.Element {
  const { change } = props;
  const transfer = change.comment.transfer;
  const data = change.comment.data;
  const otherAccount = (change.amount === transfer.to.amount)
    ? transfer.from.account : (change.amount === transfer.from.amount
      ? transfer.to.account : null);
  if (!otherAccount) {
    throw new Error(`Cannot find amount ${change.amount} from transfer ${JSON.stringify(transfer)}`);
  }
  const text = [];
  if (otherAccount.number) {
    text.push(`[${otherAccount.fund.name}] ${otherAccount.number} ${otherAccount.name}`);
  }
  if (data.investor && data.investor.name) {
    text.push(`${data.investor.name}`);
  }
  if (data.description) {
    text.push(`${data.description}`);
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <TransferImage comment={change.comment}/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Amount signed decimals={2.5} amount={change.amount} unit="€" />
          </>
        }
        secondary={
          <>
            <span>{moment(change.date).format('LL')} </span><br />
            {text.map((s, idx) => <React.Fragment key={idx}>{s}<br/></React.Fragment>)}
          </>}
      />
    </ListItem>
  );
}

export default ValueChangeListItem;
