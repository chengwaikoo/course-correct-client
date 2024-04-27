import { useRef, useState } from "react";

import TopBar from "./components/TopBar";
import Log, { LogItem } from "./components/Log";
import { Toaster } from "./components/ui/toaster";
import Page from "./pages/Page";
import usePageMargin from "./hooks/usePageMargin";

export default function App() {
  const [currStep, setCurrStep] = useState(0);
  const [logItems, setLogItems] = useState<LogItem[]>([]);

  const topBarRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  usePageMargin(topBarRef, pageRef, setTopBarHeight);

  return (
    <>
      <TopBar ref={topBarRef} currStep={currStep} />
      <Page
        ref={pageRef}
        currStep={currStep}
        setCurrStep={setCurrStep}
        setLogItems={setLogItems}
      />
      <Log logItems={logItems} setLogItems={setLogItems} />
      <Toaster topBarHeight={topBarHeight} />
    </>
  );
}
