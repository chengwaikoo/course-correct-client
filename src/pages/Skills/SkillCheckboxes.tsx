import { useFormContext } from "react-hook-form";

import { renderSkill } from "./utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface SkillCheckboxesProps {
  skillLines: string[];
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SkillCheckboxes({
  skillLines,
  selectAll,
  setSelectAll,
}: SkillCheckboxesProps) {
  const { clearErrors, control, setValue } = useFormContext();

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);

    if (checked) {
      setValue(
        "lineIndexes",
        skillLines.map((_, index) => index),
        { shouldDirty: true },
      );
      clearErrors("lineIndexes");
    } else {
      setValue("lineIndexes", [], { shouldDirty: true });
    }
  };

  return (
    <FormField
      control={control}
      name="lineIndexes"
      render={() => (
        <FormItem>
          <FormLabel className="text-base font-normal text-foreground">
            Choose the skills you'd like to learn or improve:
          </FormLabel>
          <div className="mt-6 space-y-5">
            <FormItem className="flex space-x-3">
              <FormControl className="mt-[0.14rem]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAllChange}
                />
              </FormControl>
              <FormLabel className="font-semibold italic text-foreground">
                Select/deselect all
              </FormLabel>
            </FormItem>

            {skillLines.map((line, index) => (
              <FormField
                key={index}
                control={control}
                name="lineIndexes"
                render={({ field }) => (
                  <FormItem key={index} className="flex space-x-3">
                    <FormControl className="mt-[0.14rem]">
                      <Checkbox
                        checked={field.value?.includes(index)}
                        onCheckedChange={(checked) => {
                          let newValue;
                          if (checked) {
                            const insertIndex = field.value.findIndex(
                              (value: number) => value > index,
                            );
                            if (insertIndex === -1) {
                              newValue = [...field.value, index];
                            } else {
                              newValue = [
                                ...field.value.slice(0, insertIndex),
                                index,
                                ...field.value.slice(insertIndex),
                              ];
                            }
                          } else {
                            newValue = field.value.filter(
                              (value: number) => value !== index,
                            );
                          }

                          field.onChange(newValue);

                          if (!checked) {
                            setSelectAll(false);
                          } else if (newValue.length === skillLines.length) {
                            setSelectAll(true);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {renderSkill(line)}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage className="mt-5" />
        </FormItem>
      )}
    />
  );
}
