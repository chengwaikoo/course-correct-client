import { useEffect, useRef } from "react";
import { useHeightContext } from "@/contexts/HeightContext";

export default function useTextareasHeight(numPostings: number) {
  const { setContentHeight } = useHeightContext();
  const textareaRefs = useRef<HTMLTextAreaElement[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateContentHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLTextAreaElement) {
          updateContentHeight();
        }
      }
    });

    const textareas = textareaRefs.current;
    const observeTextareas = () => {
      textareas.forEach((textareaRef) => {
        if (textareaRef) {
          observer.observe(textareaRef);
        }
      });
    };

    const unobserveTextareas = () => {
      textareas.forEach((textareaRef) => {
        if (textareaRef) {
          observer.unobserve(textareaRef);
        }
      });
    };

    observeTextareas();

    return () => {
      unobserveTextareas();
      observer.disconnect();
    };
  }, [numPostings, setContentHeight]);

  const setTextareaRef = (index: number) => (ref: HTMLTextAreaElement) => {
    textareaRefs.current[index] = ref;
  };

  return {
    setTextareaRef,
    contentRef,
  };
}
