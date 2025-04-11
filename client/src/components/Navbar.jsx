import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import { Typography, Link, Divider, AppBar, Toolbar } from '@mui/material';
import Stack from '@mui/material/Stack';
import supabase from '../config/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          {user ? (
            <Typography variant="h6">
              <Link
                component="button"
                onClick={handleLogout}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                Logout
              </Link>
            </Typography>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
