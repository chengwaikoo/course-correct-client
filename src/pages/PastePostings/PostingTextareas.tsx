import { useFormContext } from "react-hook-form";

import PasteButton from "./PasteButton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface PostingTextareasProps {
  numPostings: number;
  setTextareaRef: (index: number) => (ref: HTMLTextAreaElement) => void;
}

export default function PostingTextareas({
  numPostings,
  setTextareaRef,
}: PostingTextareasProps) {
  const { control, formState } = useFormContext();

  return Array.from({ length: numPostings }, (_, index) => (
    <FormField
      key={index}
      control={control}
      name={`postings.${index}`}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-2">
          <FormLabel
            className={formState.errors.postingsValid ? "text-destructive" : ""}
          >
            Posting {index + 1}
          </FormLabel>
          <div className="relative flex">
            <FormControl>
              <Textarea
                className="min-h-32 text-xs leading-snug"
                {...field}
                ref={setTextareaRef(index)}
              />
            </FormControl>
            {field.value.trim() === "" && <PasteButton index={index} />}
          </div>
        </FormItem>
      )}
    />
  ));
}
