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

  return (
    <div>
      <Typography variant="h1">Welcome Back!</Typography>
      <Button
        onClick={handleLogOut}
        sx={{ backgroundColor: 'secondary.light', color: 'black' }}>
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
