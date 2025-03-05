import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Container } from '@mui/material';
import DashboardMenu from './DahsboardMenu';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const d3Container = useRef(null);

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

  return (
    <Container
      sx={{ display: 'flex', justifyContent: 'center' }}
      alignitems="center">
      <DashboardMenu
        d3Container={d3Container}
        onExpenseAdded={addNewExpense}
        expenses={expenses}
        loading={loading}
      />

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
