import { createContext, useContext, Dispatch, SetStateAction } from "react";

interface HeightContextType {
  contentHeight: number;
  setContentHeight: Dispatch<SetStateAction<number>>;
}

const HeightContext = createContext<HeightContextType | undefined>(undefined);

export const useHeightContext = (): HeightContextType => {
  const context = useContext(HeightContext);
  if (context === undefined) {
    throw new Error("useHeightContext must be used within an HeightProvider");
  }
  return context;
};

export default HeightContext;
