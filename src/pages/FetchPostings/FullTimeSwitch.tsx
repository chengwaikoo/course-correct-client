import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export default function FullTimeSwitch() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="toFetchFullTime"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="font-normal">Only full-time jobs</FormLabel>
        </FormItem>
      )}
    />
  );
}
