import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import useStyles from '../styles';
import HelpIcon from '@material-ui/icons/Help';
import SyncIcon from '@material-ui/icons/Sync';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import EuroIcon from '@material-ui/icons/Euro';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

function TransferImage(props) {
  const { comment } = props;
  const classes = useStyles();
  let Icon, color, text, str;
  const type = comment && comment.data && (comment.data.subtype || comment.data.type);
  switch (type) {
    case 'divestment':
      text = 'Divestment';
      Icon = RestoreFromTrashIcon;
      color = 'indigo';
      break;
    case 'investment':
      text = 'Investment';
      Icon = SaveAltIcon;
      color = 'indigo';
      break;
    case 'dividend':
      text = 'Dividend';
      str = '-%';
      color = 'pink';
      break;
    case 'expense':
      text = 'Expense';
      Icon = ShoppingCartIcon;
      color = 'pink';
      break;
    case 'tax':
      if (comment.data.type === 'deposit') {
        text = 'Tax Refund';
        color = 'yellow';
        Icon = AssignmentReturnedIcon;
      } else {
        text = 'Tax Payment';
        color = 'yellow';
        Icon = AssignmentReturnIcon;
      }
      break;
    case 'loan':
      text = 'Loan';
      color = 'orange';
      Icon = AssignmentReturnedIcon;
      break;
    case 'interest':
      text = 'VAT Refund';
      color = 'lightGreen';
      str = '+%';
      break;
    case 'vat':
      if (comment.data.type === 'deposit') {
        text = 'VAT Refund';
        color = 'yellow';
        str = '+%';
      } else {
        text = 'VAT Payment';
        color = 'yellow';
        str = '-%';
      }
      break;
    case 'sales':
      text = 'Sales Profit';
      Icon = ShoppingCartIcon;
      color = 'lightGreen';
      break;
    case 'capital':
      text = 'Additional Capital';
      Icon = EuroIcon;
      color = 'green';
      break;
    case 'equity':
      text = 'Equity';
      Icon = AccountBalanceIcon;
      color = 'green';
      break;
    case 'withdrawal':
      text = 'Withdrawal';
      Icon = RemoveCircleIcon;
      color = 'orange';
      break;
    case 'deposit':
      text = 'Deposit';
      Icon = AddCircleIcon;
      color = 'green';
      break;
    case 'internal-transfer':
    case 'savings':
    case 'fund':
      text = 'Internal Transfer';
      Icon = SyncIcon;
      color = 'indigo';
      break;
    default:
      text = `Unknown type ${type}`;
      Icon = HelpIcon;
      color = 'red';
  }
  if (str) {
    return <Avatar alt={text} title={text} variant="square" className={classes[color]}>{str}</Avatar>;
  }
  return <Avatar alt={text} title={text} variant="square" className={classes[color]}><Icon fontSize="large"/></Avatar>;
}

TransferImage.propTypes = {
  comment: PropTypes.object.isRequired
};

export default TransferImage;
