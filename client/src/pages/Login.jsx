import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import { Box, TextField, Button, Alert, Container } from '@mui/material';

const Login = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('User: ', data.user.user_metadata.email);
        console.log('Login successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('An unexpected error occurred: ', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
          fullWidth
          sx={{
            mt: 2,
            width: '15rem',
            backgroundColor: 'secondary.light',
            color: 'black',
          }}>
          Log In
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

export default Login;
