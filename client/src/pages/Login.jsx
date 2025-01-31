import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';

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
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">
          Email:
          <input
            type="email"
            id="login-email"
            name="login-email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="login-password">
          Password:
          <input
            type="password"
            id="login-password"
            name="login-password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
