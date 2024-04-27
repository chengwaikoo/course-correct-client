import { createContext, useContext, Dispatch, SetStateAction } from "react";

export type Theme = "dark" | "light";

interface UIContextType {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  errored: boolean;
  setErrored: Dispatch<SetStateAction<boolean>>;
  showBottomBar: boolean;
  setShowBottomBar: Dispatch<SetStateAction<boolean>>;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUIContext must be used within an UIProvider");
  }
  return context;
};

export default UIContext;
