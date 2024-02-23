import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToggleColorMode } from "@/theme";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ToggleColorMode>
            <CssBaseline />
            {props.children}
          </ToggleColorMode>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
