import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToggleColorMode } from "@/theme";
import { Toaster } from "react-hot-toast";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ToggleColorMode>
            <CssBaseline />
            <Toaster />
            {props.children}
          </ToggleColorMode>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
