import { ReactNode, createContext, useContext, useState } from "react";

interface MyContextType {
  state: string | ArrayBuffer | null;
  updateState: (newValue: string | ArrayBuffer | null) => void;
}

export const MyContext = createContext<MyContextType>({
  state: null,
  updateState: () => {},
});

export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<string | ArrayBuffer | null>(null);

  const updateState = (newValue: string | ArrayBuffer | null) => {
    setState(newValue);
  };

  return (
    <MyContext.Provider value={{ state, updateState }}>
      {children}
    </MyContext.Provider>
  );
}
