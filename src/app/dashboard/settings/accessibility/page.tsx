"use client";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "@/context";
import { useContext, useState } from "react";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

export default function Home() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  let localFont = "14";
  if (typeof window !== "undefined") {
    localFont = localStorage.getItem("font") ?? "14";
  }
  const [fontSize, setFontSize] = useState(parseInt(localFont));

  const handleChange = (event: SelectChangeEvent<number>) => {
    setFontSize(event.target.value as number);
    colorMode.changeFontSize(event.target.value as number);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
      }}
    >
      <Stack spacing={2}>
        {theme.palette.mode} mode
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
        <InputLabel>Font Size</InputLabel>
        <Select value={fontSize} label="FontSize" onChange={handleChange}>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={13}>13</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Stack>
    </Box>
  );
}
