import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import { Button, Typography } from '@mui/material';

const Dashboard = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      console.log('Log out successfully!');
      navigate('/');
    }
  };

  const handleNewExpense = () => {
    navigate('/entryform');
  };

  return (
    <div>
      <Typography variant="h1">Welcome Back!</Typography>
      <Button
        variant="contained"
        onClick={handleNewExpense}
        sx={{ width: '10rem' }}>
        Add Entry
      </Button>
      <Button
        onClick={handleLogOut}
        variant="contained"
        xs={{
          width: { xs: '100%', sm: 'auto' },
          fontSize: { xs: '0.8rem', sm: '1rem' },
        }}>
        Log Out
      </Button>
      {error && (
        <Typography variant="subtitle2" sx={{ color: 'danger.main' }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default Dashboard;
