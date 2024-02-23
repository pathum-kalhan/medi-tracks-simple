import { createContext } from "react";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  changeFontSize: (size: number) => {},
});
