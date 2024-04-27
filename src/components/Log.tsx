import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useUIContext } from "@/contexts/UIContext";
import Icon from "./Icon";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export interface LogItem {
  type: string;
  message: string;
  endMessage?: string;
  loading?: boolean;
  errored?: boolean;
}

interface SessionIDData {
  session_id: string;
}

interface LogProps {
  logItems: LogItem[];
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>;
}

export default function Log({ logItems, setLogItems }: LogProps) {
  const { loading, errored, setErrored } = useUIContext();
  const { toast } = useToast();

  const showLog = loading || errored;

  const logRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      closeButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (showLog) {
      logRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    } else {
      setLogItems([]);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLog, setLogItems]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      reconnectionAttempts: 3,
    });

    socket.on("session_id", (data: SessionIDData) => {
      sessionStorage.setItem("sessionID", data.session_id);
    });

    socket.on("disconnect", (reason) => {
      console.error(`Socket disconnected. Reason: ${reason}`);
      const message = socket.active ? "Reconnecting..." : "Disconnected";

      toast({
        description: (
          <span className={socket.active ? "" : "text-destructive"}>
            {message}
          </span>
        ),
      });
    });

    socket.io.on("reconnect", () => {
      toast({
        description: "Reconnected",
      });
    });

    socket.io.on("reconnect_failed", () => {
      toast({
        description: (
          <span className="text-destructive">Couldn't connect to server</span>
        ),
      });
    });

    socket.on("update", (data) => {
      setLogItems((prev) => {
        const newItems = [...prev];
        const item = {
          type: "update",
          message: data.message,
          endMessage: data.endMessage,
          loading: true,
        };

        if (data.endMessage !== "Loaded models") {
          const lastUpdateIndex = prev.findLastIndex(
            (item: LogItem) => item.type === "update",
          );
          if (lastUpdateIndex !== -1) {
            newItems[lastUpdateIndex] = {
              ...newItems[lastUpdateIndex],
              loading: false,
            };
          }
        }

        return [...newItems, item];
      });
    });

    socket.on("end", (data) => {
      setLogItems((prev) => {
        const newItems = [...prev];

        const lastUpdateIndex = prev.findLastIndex(
          (item: LogItem) =>
            item.type === "update" && item.endMessage === data.endMessage,
        );
        if (lastUpdateIndex !== -1) {
          newItems[lastUpdateIndex] = {
            ...newItems[lastUpdateIndex],
            loading: false,
          };
        }

        return [...newItems];
      });
    });

    socket.on("warning", (data) => {
      setLogItems((prev) => {
        const item = { type: "warning", message: data.message };
        return [...prev, item];
      });
    });

    return () => {
      socket.off("update");
      socket.off("end");
      socket.off("warning");
      socket.disconnect();
    };
  }, [setLogItems, toast]);

  if (!showLog) {
    return null;
  }

  const loadingPlaceholder = (
    <div className="flex items-center space-x-2">
      <div className="flex w-5 justify-center">
        <Icon type="spinner" fixedWidth />
      </div>
      <span>Loading...</span>
    </div>
  );

  const getIconType = (type: string, loading?: boolean, errored?: boolean) => {
    if (errored || type === "error") {
      return "error";
    } else if (loading) {
      return "spinner";
    } else if (type === "update") {
      return "success";
    } else {
      return type;
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="mx-6 rounded-md bg-popover p-4 text-popover-foreground shadow-lg focus:outline-none"
        ref={logRef}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setErrored(false);
          }
        }}
      >
        <div className="space-y-2.5 leading-snug">
          {logItems.length === 0 && loadingPlaceholder}
          {logItems.map(
            ({ message, endMessage, type, loading, errored }, index) => {
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <div className="flex w-5 justify-center">
                    <Icon
                      type={getIconType(type, loading, errored)}
                      fixedWidth
                    />
                  </div>
                  <span className={type === "error" ? "text-destructive" : ""}>
                    {type === "update" && !loading && !errored
                      ? endMessage
                      : message}
                  </span>
                </div>
              );
            },
          )}
        </div>
        {errored && (
          <div className="mt-6 flex justify-center">
            <Button
              ref={closeButtonRef}
              onClick={() => {
                setErrored(false);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
