import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from '@mui/material';
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

  // define mapping objects to get the labels
  const categoryMap = {
    rent: 'Rent',
    home: 'Home',
    utilities: 'Utilities',
    travel: 'Travel',
    groceries: 'Groceries',
    social: 'Social',
    dining: 'Dining',
    shopping: 'Shopping',
    healthcare: 'Healthcare',
    education: 'Education',
    gifts: 'Gifts',
    subscriptions: 'Subscriptions',
    other: 'Other',
  };

  const paymentMap = {
    cash: 'Cash',
    credit: 'Credit Card',
    debit: 'Debit Card',
    bankTransfer: 'Bank Transfer',
    mobilePay: 'Mobile Payment',
    other: 'Other',
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCategoryLabel = (categoryValue) => {
    return categoryMap[categoryValue] || categoryValue;
  };

  const getPaymentMethodLabel = (paymentValue) => {
    return paymentMap[paymentValue] || paymentValue;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          aria-label="dashboard tabs">
          <Tab label="Expenses Overview" {...a11yProps(0)} />
          <Tab label="Custom Summary" {...a11yProps(1)} />
          {/* <Tab label="Reports" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Container>
          <Box sx={{ display: 'inline-flex', alignitems: 'center' }}>
            <EntryForm onExpenseAdded={onExpenseAdded} />
            <ExpenseOverview expenses={expenses} loading={loading} />
          </Box>
          <TableContainer component={Paper}>
            {/* {console.log(expenses)} */}
            <Table sx={{ minWidth: 650 }} aria-label="expenses table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Description</TableCell>
                  {/* <TableCell>Tags</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading expenses...
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell>{getCategoryLabel(row.category)}</TableCell>
                      <TableCell>{row.title || 'N/A'}</TableCell>
                      <TableCell>${row.amount?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        {getPaymentMethodLabel(row.payment_method)}
                      </TableCell>
                      <TableCell>{row.description || '--'}</TableCell>
                      {/* <TableCell align="right">
                        {Array.isArray(row.tags)
                          ? row.tags.join(', ')
                          : row.tags || 'No tags'}
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Custom Summary Coming Soon
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        Reports Coming Soon
      </CustomTabPanel> */}
    </Box>
  );
};

export default DashboardMenu;
