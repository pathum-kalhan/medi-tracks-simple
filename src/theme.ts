"use client";
import { Roboto } from "next/font/google";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface Palette {
    purple: Palette["primary"];
    green: Palette["primary"];
  }
  interface PaletteOptions {
    purple?: PaletteOptions["primary"];
    green?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    purple: true;
    green: true;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#416BFF",
    },
    purple: {
      main: "#3700B3",
      contrastText: "#fff",
    },
    green: {
      main: "#01A324",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
});

export default theme;
