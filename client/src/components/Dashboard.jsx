import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Container, Box, Tabs, Tab } from '@mui/material';
import ExpenseOverviewForm from './ExpenseOverviewForm';
import ExpenseOverviewChart from './ExpenseOverviewChart';
import ExpenseOverviewTable from './ExpenseOverviewTable';
import CustomSummary from './CustomSummary';

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        // console.log('Expenses data:', data);

        if (error) {
          setError(error.message);
          console.error('Supabase query error:', error);
          throw new Error(error.message);
        }

        setExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  // const handleLogOut = async () => {
  //   await supabase.auth.signOut();

  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     console.log('Log out successfully!');
  //     navigate('/');
  //   }
  // };

  const addNewExpense = (newExpense) => {
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
  };

  const onExpenseDeleted = (deletedId) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== deletedId)
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
            <Tab label="Expense Overview" {...a11yProps(0)} />
            <Tab label="Custom Summary" {...a11yProps(1)} />
            {/* <Tab label="Reports" {...a11yProps(2)} /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Container>
            <Box sx={{ display: 'inline-flex', alignitems: 'center' }}>
              <ExpenseOverviewForm onExpenseAdded={addNewExpense} />
              <ExpenseOverviewChart expenses={expenses} loading={loading} />
            </Box>
            <ExpenseOverviewTable
              expenses={expenses}
              loading={loading}
              onExpenseDeleted={onExpenseDeleted}
            />
          </Container>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CustomSummary />
        </CustomTabPanel>
      </Box>

      {/* <Box display="flex" justifyContent="center">
            <Button
              onClick={handleLogOut}
              variant="contained"
              sx={{ width: '8rem' }}>
              Log Out
            </Button>
          </Box> */}

      {error && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;
