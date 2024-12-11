// theme.js
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000", // Black background
      paper: "#121212",   // Slightly lighter for cards or modals
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#bdbdbd", // Slightly muted white
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
            textTransform: 'none', // Prevent uppercase text
          borderRadius: '8px',  // Rounded corners
          padding: '10px 20px', // Custom padding
          position: 'relative'
        },
    }
}}
});

export default darkTheme;
