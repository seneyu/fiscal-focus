import React from 'react';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

const Home = () => {
  return (
    <Stack
      spacing={4}
      justifyContent="center"
      sx={{
        minHeight: '50vh',
        padding: '0 8rem',
      }}>
      <Typography variant="h1">Track. Save. Succeed.</Typography>
      <Typography variant="h3">
        Are you tired of wondering where your money goes each month? Our expense
        tracking app makes it easy to manage your spending, set budgets, and
        reach your financial goals!
      </Typography>
    </Stack>
  );
};

export default Home;
