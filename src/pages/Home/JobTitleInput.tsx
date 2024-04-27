import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
          <FormLabel className="text-lg text-foreground">
            Enter a desired job title:
          </FormLabel>
          <div className="flex space-x-3.5">
            <FormControl>
              <Input
                className="h-[2.67rem] text-base"
                placeholder="e.g. data analyst"
                {...field}
                ref={inputRef}
              />
            </FormControl>
            <Button
              className="h-[2.67rem] min-w-0 flex-grow text-base"
              type="submit"
            >
              Start
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
}
