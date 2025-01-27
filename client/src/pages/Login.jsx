import React from 'react';

const Login = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'example' }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.log('error: ', err);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
