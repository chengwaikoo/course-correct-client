import { useMemo, useState, ReactNode } from "react";

import HeightContext from "./HeightContext";

interface HeightProviderProps {
  children: ReactNode;
}

export default function HeightProvider({ children }: HeightProviderProps) {
  const [contentHeight, setContentHeight] = useState(0);

  const value = useMemo(() => {
    return {
      contentHeight,
      setContentHeight,
    };
  }, [contentHeight]);

  return (
    <HeightContext.Provider value={value}>{children}</HeightContext.Provider>
  );
}
