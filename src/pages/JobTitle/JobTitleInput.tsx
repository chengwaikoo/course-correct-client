import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function JobTitleInput() {
  const { control } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <FormField
      control={control}
      name="jobTitle"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base font-normal text-foreground">
            Enter a desired job title:
          </FormLabel>
          <FormControl>
            <Input placeholder="e.g. data analyst" {...field} ref={inputRef} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
