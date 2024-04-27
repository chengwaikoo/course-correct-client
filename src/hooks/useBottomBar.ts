import { useEffect, useRef } from "react";
import debounce from "debounce";

import { useHeightContext } from "@/contexts/HeightContext";
import { useUIContext } from "@/contexts/UIContext";

export default function useBottomBar(
  topBarRef: React.RefObject<HTMLDivElement>,
) {
  const { contentHeight } = useHeightContext();
  const { setShowBottomBar } = useUIContext();
  const contentHeightRef = useRef(contentHeight);

  const updateBottomBar = () => {
    if (topBarRef.current) {
      const baseFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );

      // 1.5 rem - padding between content and top bar
      // 6.5 rem - height of bottom bar including padding and margin
      const spaceY = 8 * baseFontSize;

      setShowBottomBar(
        topBarRef.current.offsetHeight + contentHeightRef.current + spaceY >=
          window.innerHeight,
      );
    }
  };

  const updateBottomBarDebounced = useRef(debounce(updateBottomBar, 100));

  useEffect(() => {
    contentHeightRef.current = contentHeight;
    updateBottomBarDebounced.current();
  }, [contentHeight]);
}
