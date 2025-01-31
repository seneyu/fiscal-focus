import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';

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
      <div>Welcome to Dashboard!</div>
      <button onClick={handleLogOut}>Log Out</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
