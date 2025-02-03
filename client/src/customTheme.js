import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    primary: {
      main: '#F3EAE3',
    },
    secondary: {
      main: '#B6E2D3',
      light: '#D8EEE6',
    },
    tertiary: {
      main: '#D8A7B1',
    },
    danger: {
      main: '#EF7C8E',
    },
  },
  typography: {
    h1: {
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3rem',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    subtitle: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          width: '100px',
        },
        contained: {
          backgroundColor: '#B6E2D3',
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgb(189, 238, 220)',
          },
        },
      },
    },
  },
});

// theme.typography.h3 = {
//   fontSize: '1.2rem',
//   '@media (min-width:600px)': {
//     fontSize: '1.5rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '2.4rem',
//   },
// };

theme = responsiveFontSizes(theme);

export { theme };
