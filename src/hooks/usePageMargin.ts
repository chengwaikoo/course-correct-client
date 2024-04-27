import { useEffect } from "react";

export default function usePageMargin(
  topBarRef: React.RefObject<HTMLDivElement>,
  pageRef: React.RefObject<HTMLDivElement>,
  setTopBarHeight: (height: number) => void,
) {
  useEffect(() => {
    const topBar = topBarRef.current;
    const updatePageMargin = () => {
      if (topBar && pageRef.current) {
        const height = topBar.offsetHeight;
        pageRef.current.style.marginTop = `${height}px`;
        setTopBarHeight(height);
      }
    };
    updatePageMargin();

    const resizeObserver = new ResizeObserver(updatePageMargin);
    if (topBar) {
      resizeObserver.observe(topBar);
    }

    return () => {
      if (topBar) {
        resizeObserver.unobserve(topBar);
      }
    };
  }, [topBarRef, pageRef, setTopBarHeight]);
}
