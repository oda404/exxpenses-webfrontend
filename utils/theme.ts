// import { Roboto } from '@next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// export const roboto = Roboto({
//     weight: ['300', '400', '500', '700'],
//     subsets: ['latin'],
//     display: 'swap',
//     fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#cccccc"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: 0,
                    padding: 0,
                    minHeight: 0,
                    minWidth: 0,
                    display: "inline-block"
                }
            },
            defaultProps: {
                disableRipple: true
            }
        }
    }
    // typography: {
    //     fontFamily: roboto.style.fontFamily,
    // },
});

export default theme;
