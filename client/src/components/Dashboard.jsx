import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Typography, Container } from '@mui/material';
import ExpenseOverview from './ExpenseOverview';
import { GET_EXPENSES } from '../apollo/queries';
import { EXPENSE_ADDED } from '../apollo/subscriptions';
import { useQuery, useSubscription } from '@apollo/client';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth error:', error);
          navigate('/login');
          return;
        }

        if (!user) {
          console.log('No user found');
          navigate('/login');
          return;
        }

        console.log('User authenticated:', user.id);
        setUser(user);
      } catch (error) {
        console.error('Error checking user: ', error);
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  // query for initial expenses data
  const {
    loading,
    error: queryError,
    data: queryData,
  } = useQuery(GET_EXPENSES, {
    variables: { userId: user?.id },
    skip: !user?.id,
    onCompleted: (data) => {
      console.log('Query completed with data:', data);
      setExpenses(data.expenses || []);
    },
  });

  // subscribe to new expenses
  const { data: subscriptionData } = useSubscription(EXPENSE_ADDED);

  // update expenses when subscription delivers new data
  useEffect(() => {
    if (subscriptionData?.onExpenseAdded) {
      const newExpense = subscriptionData.onExpenseAdded;
      console.log('Subscription data received:', newExpense);

      if (newExpense.user_id === user?.id) {
        setExpenses((prevExpenses) => {
          console.log('Adding new expense to state:', newExpense);
          const updatedExpenses = [newExpense, ...prevExpenses];
          console.log('New expenses state:', updatedExpenses);
          return updatedExpenses;
        });
      }
    }
  }, [subscriptionData, user]);

  useEffect(() => {
    console.log('Current expenses state:', expenses);
  }, [expenses]);

  return (
    <Container
      sx={{ display: 'flex', justifyContent: 'center' }}
      alignitems="center">
      <ExpenseOverview expenses={expenses || []} loading={loading} />

      {queryError && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {queryError.message}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;
