import React from 'react';
import { Typography, Box } from '@material-ui/core';

interface TabPanelProps {
  children: JSX.Element[] | JSX.Element | string;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

export default TabPanel;
