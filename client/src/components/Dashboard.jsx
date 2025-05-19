import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Container, Box, Tabs, Tab } from '@mui/material';
import ExpenseDetailsForm from './ExpenseDetailsForm';
import ExpenseDetailsChart from './ExpenseDetailsChart';
import ExpenseDetailsTable from './ExpenseDetailsTable';
import CustomSummary from './CustomSummary';
import CashFlow from './CashFlow';

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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [date, setDate] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // fetch current month string
  useEffect(() => {
    const getCurrMonth = () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // format both dates
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedFirstDay = firstDay.toLocaleDateString('en-US', options);
      const formattedLastDay = lastDay.toLocaleDateString('en-US', options);

      const periodString = `${formattedFirstDay} - ${formattedLastDay}`;
      setDate(periodString);
    };

    getCurrMonth();
  }, [navigate]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setError(userError.message);
          throw new Error(userError.message);
        }

        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        // get current month range
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
        const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', firstDay)
          .lte('date', lastDay)
          .order('date', { ascending: false });

        console.log('Expenses data:', data);

        if (error) {
          setError(error.message);
          console.error('Supabase query error:', error);
          throw new Error(error.message);
        }

        setExpenses(data);
      } catch (err) {
        setError(error.message);
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const addNewExpense = (newExpense) => {
    if (isCurrentMonth(newExpense.date)) {
      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    }
  };

  const onExpenseDeleted = (deletedId) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== deletedId)
    );
  };

  const onExpenseUpdated = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  // check if modified entry is for current month
  const isCurrentMonth = (dateString) => {
    const now = new Date();
    const expenseDate = new Date(dateString);
    return (
      expenseDate.getFullYear() === now.getFullYear() &&
      expenseDate.getMonth() === now.getMonth()
    );
  };

  return (
    <Container
      sx={{ display: 'flex', justifyContent: 'center' }}
      alignitems="center">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            aria-label="dashboard tabs">
            <Tab label="Cash Flow" {...a11yProps(0)} />
            <Tab label="Spending" {...a11yProps(1)} />
            <Tab label="Custom Summary" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <CashFlow date={date} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Container>
            {/* <Box sx={{ display: 'inline-flex', alignitems: 'center' }}> */}
            <Box>
              {/* <ExpenseDetailsForm onExpenseAdded={addNewExpense} /> */}
              <ExpenseDetailsChart
                date={date}
                expenses={expenses}
                loading={loading}
              />
            </Box>
            <ExpenseDetailsTable
              expenses={expenses}
              loading={loading}
              onExpenseDeleted={onExpenseDeleted}
              onExpenseUpdated={onExpenseUpdated}
            />
          </Container>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <CustomSummary />
        </CustomTabPanel>
      </Box>

      {error && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;
