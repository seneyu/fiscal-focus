import React, { useState } from 'react';
import supabase from '../../supabase';

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
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="signup-email">
          Email:
          <input
            type="email"
            id="signup-email"
            name="signup-email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="signup-password">
          Password:
          <input
            type="password"
            id="signup-password"
            name="signup-password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
