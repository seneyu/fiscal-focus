import React from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import EntryForm from './components/ExpenseOverviewForm.jsx';
import NotFound from './components/NotFound.jsx';
import AuthProvider from './hooks/AuthProvider.js';
import PrivateRoute from './hooks/PrivateRoute.js';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: '/entryform',
        element: (
          <PrivateRoute>
            <EntryForm />
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
