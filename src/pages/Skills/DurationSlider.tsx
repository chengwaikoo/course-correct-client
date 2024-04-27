import { useFormContext } from "react-hook-form";

import Slider from "./RangeSlider";
import { FormField } from "@/components/ui/form";
import { DURATION_LABELS } from "@/utils/constants";

export default function DurationSlider() {
  const { control, setValue } = useFormContext();

  const handleDurationChange = (values: number[]) => {
    setValue("durationRange", values, { shouldDirty: true });
  };

  return (
    <FormField
      control={control}
      name="durationRange"
      render={({ field }) => (
        <Slider
          range={field.value}
          handleValueChange={handleDurationChange}
          stepLabels={DURATION_LABELS}
        />
      )}
    />
  );
}
