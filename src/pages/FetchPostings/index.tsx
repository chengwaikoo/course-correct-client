import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUIContext } from "@/contexts/UIContext";
import LocalSwitch from "./LocalSwitch";
import FullTimeSwitch from "./FullTimeSwitch";
import { LogItem } from "@/components/Log";
import NavBar from "@/components/NavBar";
import PrevButton from "@/components/PrevButton";
import NextButton from "@/components/NextButton";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import useContentHeight from "@/hooks/useContentHeight";
import useLog from "@/hooks/useLog";
import { FormData as SkillFormData } from "@/pages/Skills";
import { PostingOption, Steps } from "@/utils/constants";

export interface FormData {
  toFetchLocal: boolean;
  toFetchFullTime: boolean;
}

const formSchema = z.object({
  toFetchLocal: z.boolean(),
  toFetchFullTime: z.boolean(),
});

interface FetchPostingsProps {
  formData: FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  seenNextStep: boolean;
  setStepSeen: React.Dispatch<React.SetStateAction<number>>;
  toStep: (value: number) => void;
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>;
  jobTitle: string;
  setSkillFormData: React.Dispatch<React.SetStateAction<SkillFormData | null>>;
  setSkillLines: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FetchPostings({
  formData,
  setFormData,
  seenNextStep,
  setStepSeen,
  toStep,
  setLogItems,
  jobTitle,
  setSkillFormData,
  setSkillLines,
}: FetchPostingsProps) {
  const { setLoading, setErrored } = useUIContext();
  const { logError } = useLog(setLogItems);

  const form = useForm<FormData>({
    defaultValues: formData || {
      toFetchLocal: true,
      toFetchFullTime: false,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const sessionID = sessionStorage.getItem("sessionID");
    setFormData(data);

    fetch(`${import.meta.env.VITE_SERVER_URL}/generate-skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": sessionID || "",
      },
      body: JSON.stringify({
        jobTitle: jobTitle,
        postingOption: PostingOption.Fetch,
        toFetchLocal: data.toFetchLocal,
        toFetchFullTime: data.toFetchFullTime,
      }),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw { ...data, isCustomError: true };
          }
          return data;
        });
      })
      .then((skillLines) => {
        setSkillLines(skillLines);
        setSkillFormData(null);
        toStep(Steps.Skills);
        setStepSeen(Steps.Skills);
      })
      .catch((error) => {
        setErrored(true);
        console.error("Error on submit:", error.message);

        if (error.isCustomError) {
          logError(error.message);
        } else {
          logError("Couldn't connect to server");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const contentRef = useContentHeight();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4" ref={contentRef}>
          <FormLabel className="text-base font-normal">
            Choose which job postings to fetch:
          </FormLabel>
          <LocalSwitch />
          <FullTimeSwitch />
        </div>
        <NavBar>
          <PrevButton onClick={() => toStep(Steps.JobTitle)} />
          <Button className="min-w-0 flex-grow" type="submit">
            Generate skills
          </Button>
          {seenNextStep && (
            <NextButton
              onClick={() => toStep(Steps.Skills)}
              formIsDirty={form.formState.isDirty}
            />
          )}
        </NavBar>
      </form>
    </Form>
  );
}
