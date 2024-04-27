import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Slider as BaseSlider } from "@/components/ui/slider";

interface SliderProps {
  range: number[];
  handleValueChange: (values: number[]) => void;
  stepLabels: string[];
  // for adjustments specific to how price labels overlap
  isPriceSlider?: boolean;
}

export default function Slider({
  range,
  handleValueChange,
  stepLabels,
  isPriceSlider = false,
}: SliderProps) {
  const maxIndex = stepLabels.length - 1;
  const sliderRef = useRef<HTMLDivElement>(null);
  const minLabelRef = useRef<HTMLDivElement>(null);
  const maxLabelRef = useRef<HTMLDivElement>(null);
  const oneLabelRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [minLabelWidth, setMinLabelWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (target === sliderRef.current) {
          setSliderWidth(target.offsetWidth);
        } else if (target === minLabelRef.current) {
          setMinLabelWidth(target.offsetWidth);
        }
      }
    });

    const slider = sliderRef.current;
    const minLabel = minLabelRef.current;
    if (slider) {
      observer.observe(slider);
    }
    if (minLabel) {
      observer.observe(minLabel);
    }

    return () => {
      if (slider) {
        observer.unobserve(slider);
      }
      if (minLabel) {
        observer.unobserve(minLabel);
      }
    };
  }, []);

  const combineLabels =
    isPriceSlider && (range[1] - range[0] === 1 || range[0] >= maxIndex - 2);

  useLayoutEffect(() => {
    const minLabel = minLabelRef.current;
    const maxLabel = maxLabelRef.current;
    const oneLabel = oneLabelRef.current;

    if (combineLabels) {
      if (oneLabel) {
        let newLeft = "";
        let newRight = "";
        if (range[0] > 0 && range[0] < maxIndex - 3) {
          newLeft = `calc((${sliderWidth}px - 1.25rem) * ${
            (range[0] + 0.5) / maxIndex
          } + 0.625rem - ${oneLabel.offsetWidth / 2}px)`;
        } else if (range[0] >= maxIndex - 3) {
          newRight = "0";
        }
        oneLabel.style.left = newLeft;
        oneLabel.style.right = newRight;
      }
    } else {
      if (minLabel) {
        setMinLabelWidth(minLabel.offsetWidth);
        if (range[0] > 0) {
          minLabel.style.left = `calc((${sliderWidth}px - 1.25rem) * ${
            range[0] / maxIndex
          } + 1.25rem - ${minLabel.offsetWidth}px)`;
        } else {
          minLabel.style.left = "";
        }
      }

      if (maxLabel) {
        let newLeft = "";
        let newRight = "";
        if (range[1] === maxIndex) {
          newRight = "0";
        } else {
          newLeft = `calc((${sliderWidth}px - 1.25rem) * ${
            range[1] / maxIndex
          }`;
        }
        maxLabel.style.left = newLeft;
        maxLabel.style.right = newRight;
      }
    }
  }, [range, sliderWidth, maxIndex, combineLabels, minLabelWidth]);

  return (
    <div className="relative pb-7" ref={sliderRef}>
      <BaseSlider
        defaultValue={range}
        max={maxIndex}
        onValueChange={handleValueChange}
        minStepsBetweenThumbs={1}
      />
      {combineLabels ? (
        <div className="label absolute mt-2.5 text-xs" ref={oneLabelRef}>
          {stepLabels[range[0]]}&ndash;{stepLabels[range[1]]}
        </div>
      ) : (
        <>
          <div className="label absolute mt-2.5 text-xs" ref={minLabelRef}>
            {stepLabels[range[0]]}
          </div>
          <div className="label absolute mt-2.5 text-xs" ref={maxLabelRef}>
            {stepLabels[range[1]]}
          </div>
        </>
      )}
    </div>
  );
}
