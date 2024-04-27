import { useFormContext } from "react-hook-form";

import Slider from "./RangeSlider";
import { FormField } from "@/components/ui/form";
import { PRICE_LABELS } from "@/utils/constants";

export default function PriceSlider() {
  const { control, setValue } = useFormContext();

  const handlePriceChange = (values: number[]) => {
    setValue("priceRange", values, { shouldDirty: true });
  };

  return (
    <FormField
      control={control}
      name="priceRange"
      render={({ field }) => (
        <Slider
          range={field.value}
          handleValueChange={handlePriceChange}
          stepLabels={PRICE_LABELS}
          isPriceSlider={true}
        />
      )}
    />
  );
}
