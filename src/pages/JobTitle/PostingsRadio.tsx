import { useFormContext } from "react-hook-form";

import { PostingOption } from "@/utils/constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PostingsRadio() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="postingOption"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-normal">
            Help the AI identify skills that employers are looking for:
          </FormLabel>
          <FormControl>
            <RadioGroup
              className="mt-4 space-y-2"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormItem className="flex space-x-2.5">
                <FormControl className="mt-[0.14rem]">
                  <RadioGroupItem value={PostingOption.None} />
                </FormControl>
                <div>
                  <FormLabel className="font-normal">
                    <p>Don't use job postings</p>
                    <p className="mt-0.5 text-sm text-subtle">
                      Generate skills from just the job title
                    </p>
                  </FormLabel>
                </div>
              </FormItem>
              <FormItem className="flex space-x-2.5">
                <FormControl className="mt-[0.14rem]">
                  <RadioGroupItem value={PostingOption.Fetch} />
                </FormControl>
                <div>
                  <FormLabel className="font-normal">
                    <p>Fetch postings automatically from a job portal</p>
                    <p className="mt-0.5 text-sm text-subtle">
                      (Slow! Can take up to 2 minutes)
                    </p>
                  </FormLabel>
                </div>
              </FormItem>
              <FormItem className="flex space-x-2.5">
                <FormControl className="mt-[0.14rem]">
                  <RadioGroupItem value={PostingOption.Paste} />
                </FormControl>
                <FormLabel className="font-normal">
                  Paste job postings manually
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
