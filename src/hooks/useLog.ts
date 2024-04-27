import { useCallback } from "react";
import { useUIContext } from "@/contexts/UIContext";
import { LogItem } from "@/components/Log";

export default function useLog(
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>,
) {
  const { setErrored } = useUIContext();

  const logError = useCallback(
    (message: string) => {
      setErrored(true);

      const item = {
        type: "error",
        message: message,
      };

      setLogItems((prev) => {
        const newItems = [...prev];
        const lastUpdateIndex = prev.findLastIndex(
          (item: LogItem) => item.type === "update",
        );

        if (lastUpdateIndex !== -1) {
          newItems[lastUpdateIndex] = {
            ...newItems[lastUpdateIndex],
            errored: true,
          };
        }

        return [...newItems, item];
      });
    },
    [setErrored, setLogItems],
  );

  return { logError };
}
