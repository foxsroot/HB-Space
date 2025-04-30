import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1e3c72',
        },
        secondary: {
            main: '#2a5298',
        },
    },
    typography: {
        fontFamily: '"Poppins", Arial, sans-serif',
        h1: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        h2: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        h3: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        h4: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        h5: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        h6: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
        body1: {
            fontFamily: '"Poppins", Arial, sans-serif', // Apply to body text
        },
        body2: {
            fontFamily: '"Poppins", Arial, sans-serif',
        },
    },
});

export default theme;
