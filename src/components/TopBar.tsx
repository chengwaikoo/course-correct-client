import { RefObject, forwardRef } from "react";

import { useUIContext } from "@/contexts/UIContext";
import Icon from "./Icon";
import { Button } from "./ui/button";
import useBottomBar from "@/hooks/useBottomBar";

interface TopBarProps {
  currStep: number;
}

export default forwardRef<HTMLDivElement, TopBarProps>(function TopBar(
  { currStep },
  ref,
) {
  const { theme, setTheme } = useUIContext();
  const isFirstStep = currStep === 0;

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useBottomBar(ref as RefObject<HTMLDivElement>);

  return (
    <div
      ref={ref}
      className="fixed left-0 right-0 top-0 z-10 bg-top-bar font-medium text-top-bar-foreground"
    >
      <div className="mx-auto flex max-w-screen-md items-center justify-between space-x-2.5 px-6">
        <h1
          className={
            isFirstStep ? "py-4 text-xl" : "text-md pb-2 pt-2.5 font-semibold"
          }
        >
          Course Correct
        </h1>
        {isFirstStep && (
          <Button
            size="icon"
            className="bg-theme-button text-theme-button-foreground hover:bg-theme-button/90"
            title={theme === "light" ? "Use dark theme" : "Use light theme"}
            type="button"
            onClick={toggleTheme}
          >
            <Icon type={theme === "light" ? "darkTheme" : "lightTheme"} />
          </Button>
        )}
      </div>
    </div>
  );
});
