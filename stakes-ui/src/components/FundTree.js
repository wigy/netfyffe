import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TagImage from './TagImage';
import { PropTypes } from 'prop-types';
import { useHistory } from 'react-router-dom';

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)'
    }
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2)
    }
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1
  }
}));

function FundTree(props) {
  const { funds } = props;
  const classes = useTreeItemStyles();
  const history = useHistory();

  function Item(props) {
    const { type, target, link, children = [] } = props;
    return <TreeItem
      onClick={(event) => { event.preventDefault(); link && history.push(link); }}
      nodeId={`${type}${target.id}`}
      label={
        <div className={classes.labelRoot}>
          <TagImage small tag={target.tag} className={classes.labelIcon}/>
          <Typography variant="body2" className={classes.labelText}>
            {target.name}
          </Typography>
          <Typography variant="caption" color="inherit">
            {''}
          </Typography>
        </div>}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
      }}
    >
      {children}
    </TreeItem>;
  }
  Item.propTypes = {
    children: PropTypes.any,
    link: PropTypes.string,
    target: PropTypes.object,
    type: PropTypes.string
  };

  function Fund({ fund, children }) {
    return Item({ type: 'Fund', target: fund, children });
  }

  function Account({ fund, account }) {
    return Item({
      type: 'Account',
      target: {
        id: account.id,
        tag: account.service.tag,
        name: `${account.number} ${account.name}`
      },
      link: `/accounts/${account.id}`
    });
  }

  if (!funds.length) {
    return '';
  }

  return (
    <TreeView
      defaultExpanded={funds.map(f => `Fund${f.id}`)}
      defaultCollapseIcon={<div style={{ width: 12 }} />}
      defaultExpandIcon={<div style={{ width: 12 }} />}
      defaultEndIcon={<div style={{ width: 12 }} />}
    >
      {funds.map((fund) => (
        <Fund key={fund.id} fund={fund}>
          {
            fund.accounts.map(account => <Account key={account.id} fund={fund} account={account}/>)
          }
        </Fund>
      ))}
    </TreeView>
  );
}

FundTree.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object)
};

export default FundTree;
