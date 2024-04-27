import { ReactNode } from "react";

import { useUIContext } from "@/contexts/UIContext";

export interface NavBarProps {
  children: ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  const { showBottomBar } = useUIContext();

  const bottomBar = (
    <nav
      className={`mx-auto flex max-w-screen-md space-x-3.5 py-4 ${
        showBottomBar ? "px-6" : "mt-6 w-full"
      }`}
    >
      {children}
    </nav>
  );

  if (showBottomBar) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-nav-bar">
        {bottomBar}
      </div>
    );
  } else {
    return bottomBar;
  }
}
