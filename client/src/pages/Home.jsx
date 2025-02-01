import React from 'react';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

const Home = () => {
  return (
    <Stack
      spacing={4}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '50vh',
        textAlign: 'center',
        padding: '0 8rem',
      }}>
      <Typography variant="h1">Fiscal Focus</Typography>
      <Typography variant="h3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
        similique enim ea vero asperiores assumenda itaque corrupti optio
        obcaecati, dignissimos provident nesciunt officia, harum ipsa
        reprehenderit adipisci excepturi nisi doloribus?
      </Typography>
    </Stack>
  );
};

export default Home;
