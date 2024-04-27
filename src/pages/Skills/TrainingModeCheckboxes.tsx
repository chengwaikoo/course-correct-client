import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function TrainingModeCheckboxes() {
  const { control, formState } = useFormContext();

  return (
    <FormField
      control={control}
      name="trainingModeValid"
      render={() => (
        <div className="mt-7 space-y-2.5">
          <FormLabel>Training commitment</FormLabel>
          <FormField
            control={control}
            name="partTime"
            render={({ field }) => (
              <FormItem className="flex space-x-3">
                <FormControl className="mt-[0.14rem]">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel
                  className={`font-normal ${
                    formState.errors.trainingModeValid ? "text-destructive" : ""
                  }`}
                >
                  Part-time
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="fullTime"
            render={({ field }) => (
              <FormItem className="flex space-x-3">
                <FormControl className="mt-[0.14rem]">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel
                  className={`font-normal ${
                    formState.errors.trainingModeValid ? "text-destructive" : ""
                  }`}
                >
                  Full-time
                </FormLabel>
              </FormItem>
            )}
          />
          <FormMessage />
        </div>
      )}
    />
  );
}
