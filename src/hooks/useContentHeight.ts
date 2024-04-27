import { useEffect, useRef } from "react";
import { useHeightContext } from "@/contexts/HeightContext";

export default function useContentHeight() {
  const { setContentHeight } = useHeightContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const updateContentHeight = () => {
      if (content) {
        setContentHeight(content.scrollHeight);
      }
    };
    updateContentHeight();

    const resizeObserver = new ResizeObserver(updateContentHeight);
    if (content) {
      resizeObserver.observe(content);
    }

    return () => {
      if (content) {
        resizeObserver.unobserve(content);
      }
    };
  }, [setContentHeight]);

  return contentRef;
}
