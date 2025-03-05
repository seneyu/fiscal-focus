import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import EntryForm from './EntryForm';
import ExpenseOverview from './ExpenseOverview';

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const DashboardMenu = ({ onExpenseAdded, expenses, loading }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          aria-label="dashboard tabs">
          <Tab label="Expenses" {...a11yProps(0)} />
          <Tab label="Charts" {...a11yProps(1)} />
          <Tab label="Reports" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ display: 'inline-flex', alignitems: 'center' }}>
          <EntryForm onExpenseAdded={onExpenseAdded} />
          <ExpenseOverview expenses={expenses} loading={loading} />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Reports Coming Soon
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Reports Coming Soon
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardMenu;
