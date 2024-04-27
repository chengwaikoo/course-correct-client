import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUIContext } from "@/contexts/UIContext";
import PostingsRadio from "./PostingsRadio";
import JobTitleInput from "./JobTitleInput";
import HomeButton from "./HomeButton";
import { LogItem } from "@/components/Log";
import NavBar from "@/components/NavBar";
import NextButton from "@/components/NextButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useContentHeight from "@/hooks/useContentHeight";
import useLog from "@/hooks/useLog";
import { FormData as SkillFormData } from "@/pages/Skills";
import { PostingOption, Steps } from "@/utils/constants";

export interface FormData {
  jobTitle: string;
  postingOption: PostingOption;
}

const formSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(1, "Enter a job title.")
    .max(50, "Job title must be at most 50 characters."),
  postingOption: z.nativeEnum(PostingOption),
});

interface JobTitleProps {
  formData: FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  setPostingOption: React.Dispatch<React.SetStateAction<PostingOption>>;
  seenNextStep: boolean;
  setStepSeen: React.Dispatch<React.SetStateAction<number>>;
  toPrevStep: () => void;
  toStep: (value: number) => void;
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>;
  jobTitle: string;
  setJobTitle: React.Dispatch<React.SetStateAction<string>>;
  postingOption: PostingOption;
  setSkillFormData: React.Dispatch<React.SetStateAction<SkillFormData | null>>;
  setSkillLines: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function JobTitle({
  formData,
  setFormData,
  setPostingOption,
  seenNextStep,
  setStepSeen,
  toPrevStep,
  toStep,
  setLogItems,
  jobTitle,
  setJobTitle,
  postingOption,
  setSkillFormData,
  setSkillLines,
}: JobTitleProps) {
  const { setLoading, setErrored } = useUIContext();
  const { logError } = useLog(setLogItems);

  const form = useForm<FormData>({
    defaultValues: {
      jobTitle: jobTitle,
      postingOption: formData ? formData.postingOption : PostingOption.None,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setJobTitle(data.jobTitle);
    setPostingOption(data.postingOption);

    if (data.postingOption === PostingOption.None) {
      setLoading(true);
      const sessionID = sessionStorage.getItem("sessionID");

      fetch(`${import.meta.env.VITE_SERVER_URL}/generate-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionID || "",
        },
        body: JSON.stringify({
          jobTitle: data.jobTitle,
          postingOption: PostingOption.None,
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
    } else if (data.postingOption === PostingOption.Fetch) {
      setJobTitle(data.jobTitle);
      toStep(Steps.FetchPostings);
      setStepSeen(Steps.FetchPostings);
    } else if (data.postingOption === PostingOption.Paste) {
      setJobTitle(data.jobTitle);
      toStep(Steps.PastePostings);
      setStepSeen(Steps.PastePostings);
    }
  };

  const contentRef = useContentHeight();
  const currJobTitle = form.watch("jobTitle");
  const currPostingOption = form.watch("postingOption");

  const submitButtonText = () => {
    switch (currPostingOption) {
      case PostingOption.None:
        return "Generate skills";
      case PostingOption.Fetch:
        return "Fetch postings";
      case PostingOption.Paste:
        return "Paste postings";
    }
  };

  const formIsDirty =
    formData !== null &&
    (formData.jobTitle !== currJobTitle ||
      formData.postingOption !== currPostingOption);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div ref={contentRef}>
          <div className="mb-8">
            <JobTitleInput />
          </div>
          <PostingsRadio />
        </div>
        <NavBar>
          <HomeButton
            onClick={() => {
              setJobTitle(form.watch("jobTitle"));
              toPrevStep();
            }}
          />
          <Button className="min-w-0 flex-grow" type="submit">
            {submitButtonText()}
          </Button>
          {seenNextStep && (
            <NextButton
              onClick={() => {
                switch (postingOption) {
                  case PostingOption.None:
                    toStep(Steps.Skills);
                    break;
                  case PostingOption.Fetch:
                    toStep(Steps.FetchPostings);
                    break;
                  case PostingOption.Paste:
                    toStep(Steps.PastePostings);
                    break;
                }
              }}
              formIsDirty={formIsDirty}
            />
          )}
        </NavBar>
      </form>
    </Form>
  );
}
