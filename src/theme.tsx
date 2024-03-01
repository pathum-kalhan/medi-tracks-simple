"use client";
import { Roboto } from "next/font/google";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { ColorModeContext } from "./context";
import { ThemeProvider } from "@mui/material/styles";

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

export function ToggleColorMode({ children }: { children: React.ReactNode }) {
  let localTheme;
  let localFont;
  if (typeof window !== "undefined") {
    localTheme = localStorage.getItem("theme") ?? "light";
  }
  if (typeof window !== "undefined") {
    localFont = parseInt(localStorage.getItem("font") ?? "16");
  }
  const [mode, setMode] = useState<"light" | "dark">(
    localTheme as "light" | "dark"
  );

  const [font, setFont] = useState(localFont as number);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        localStorage.setItem("theme", mode === "light" ? "dark" : "light");
      },
    }),
    [mode]
  );

  const fontSize = useMemo(
    () => ({
      changeFontSize: (size: number) => {
        setFont(size);
        localStorage.setItem("font", size.toString());
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontSize: font,
          button: {
            textTransform: "none",
          },
        },
      }),
    [mode, font]
  );
  return (
    <ColorModeContext.Provider value={{ ...colorMode, ...fontSize }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#416BFF",
//     },
//     secondary: {
//       main: "#D9D9D9",
//     },
//     purple: {
//       main: "#3700B3",
//       contrastText: "#fff",
//     },
//     green: {
//       main: "#01A324",
//       contrastText: "#fff",
//     },
//   },
//   typography: {
//     fontFamily: roboto.style.fontFamily,
//     button: {
//       textTransform: "none",
//     },
//   },
//   components: {
//     MuiAlert: {
//       styleOverrides: {
//         root: ({ ownerState }) => ({
//           ...(ownerState.severity === "info" && {
//             backgroundColor: "#60a5fa",
//           }),
//         }),
//       },
//     },
//   },
// });

// export default theme;
