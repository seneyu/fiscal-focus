import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Link, Divider, AppBar, Toolbar } from '@mui/material';
import Stack from '@mui/material/Stack';

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link
          component="button"
          onClick={handleClick}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
          <Typography variant="h4" component="div">
            Fiscal Focus
          </Typography>
        </Link>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}>
          <Typography variant="h6">
            <Link
              href="/login"
              style={{ textDecoration: 'none', color: 'inherit' }}>
              Login
            </Link>
          </Typography>
          <Typography variant="h6">
            <Link
              href="/signup"
              style={{ textDecoration: 'none', color: 'inherit' }}>
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
