import React, { useState } from 'react';
import supabase from '../../supabase';
import { Container, Box, TextField, Button, Alert } from '@mui/material';

const Signup = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('New user: ', user);
        console.log('Signup successfully!');
      }
    } catch (err) {
      console.error('An unexpected error occurred: ', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Container>
      <Box
        component="form"
        onSubmit={handleSubmit}
        // sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          mt: 4,
        }}
        noValidate
        autoComplete="off">
        <TextField
          required
          sx={{ width: '15rem' }}
          id="outlined-email-input"
          label="Email"
          type="email"
          autoComplete="current-email"
          variant="standard"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}></TextField>

        <TextField
          required
          sx={{ width: '15rem' }}
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}></TextField>

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            width: '15rem',
            backgroundColor: 'secondary.light',
            color: 'black',
          }}>
          Sign Up
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Signup;
