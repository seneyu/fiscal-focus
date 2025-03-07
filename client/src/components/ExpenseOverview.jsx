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
import ExpenseOverviewForm from './ExpenseOverviewForm';
import ExpenseOverviewChart from './ExpenseOverviewChart';
import CustomSummary from './CustomSummary';
import { getCategoryLabel, getPaymentMethodLabel } from '../utils/optionsData';

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

const ExpenseOverview = ({
  onExpenseAdded = () => {},
  expenses = [],
  loading,
}) => {
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
          <Tab label="Expense Overview" {...a11yProps(0)} />
          <Tab label="Custom Summary" {...a11yProps(1)} />
          {/* <Tab label="Reports" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Container>
          <Box sx={{ display: 'inline-flex', alignitems: 'center' }}>
            <ExpenseOverviewForm onExpenseAdded={onExpenseAdded} />
            <ExpenseOverviewChart expenses={expenses} loading={loading} />
          </Box>
          <TableContainer component={Paper} sx={{ mt: -5 }}>
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
        <CustomSummary />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        Reports Coming Soon
      </CustomTabPanel> */}
    </Box>
  );
};

export default ExpenseOverview;
