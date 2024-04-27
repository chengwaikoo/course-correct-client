import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { SSG_MID_CAREER_URL } from "@/utils/constants";

export default function MidCareerSwitch() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="sfcMidCareer"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="font-normal">
            Filter to{" "}
            <a href={SSG_MID_CAREER_URL} target="_blank" rel="noreferrer">
              SkillsFuture Credit (Mid-Career)
            </a>
            -eligible courses
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
