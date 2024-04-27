import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useUIContext } from "@/contexts/UIContext";
import PostingTextareas from "./PostingTextareas";
import { LogItem } from "@/components/Log";
import NavBar from "@/components/NavBar";
import PrevButton from "@/components/PrevButton";
import NextButton from "@/components/NextButton";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import useLog from "@/hooks/useLog";
import useTextareasHeight from "@/hooks/useTextareasHeight";
import { FormData as SkillFormData } from "@/pages/Skills";
import {
  GEO_ID_SG,
  MCF_BASE_URL,
  LINKEDIN_BASE_URL,
  Steps,
  PostingOption,
} from "@/utils/constants";

export interface FormData {
  postings: string[];
  postingsValid: boolean;
}

const formSchema = z
  .object({
    postings: z.array(z.string()),
    postingsValid: z.boolean(),
  })
  .refine((data) => data.postingsValid, {
    message: "Enter at least one posting.",
    path: ["postingsValid"],
  });

interface PastePostingsProps {
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

export default function PastePostings({
  formData,
  setFormData,
  seenNextStep,
  setStepSeen,
  toStep,
  setLogItems,
  jobTitle,
  setSkillFormData,
  setSkillLines,
}: PastePostingsProps) {
  const { setLoading, setErrored } = useUIContext();
  const { logError } = useLog(setLogItems);

  const numPostings = 3;
  const form = useForm<FormData>({
    defaultValues: formData || {
      postings: Array(numPostings).fill(""),
      postingsValid: true,
    },
    resolver: zodResolver(formSchema),
  });

  const watchPostings = Array.from({ length: numPostings }, (_, index) => {
    return form.watch(`postings.${index}`);
  });
  const postingsValid = watchPostings.some(
    (posting) => posting.trim().length > 0,
  );

  useEffect(() => {
    form.setValue("postingsValid", postingsValid);
    if (postingsValid) {
      form.clearErrors("postingsValid");
    } else if (form.formState.isSubmitted) {
      form.setError("postingsValid", {
        message: "Enter at least one posting.",
      });
    }
  }, [postingsValid, form]);

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
        postingOption: PostingOption.Paste,
        postings: data.postings,
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

  const { setTextareaRef, contentRef } = useTextareasHeight(numPostings);
  const jobTitleURI = encodeURIComponent(jobTitle);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div ref={contentRef}>
          <FormField
            control={form.control}
            name="postingsValid"
            render={() => (
              <>
                <FormLabel className="text-base font-normal text-foreground">
                  Paste up to 3 job postings:
                </FormLabel>
                <p className="mt-2.5 text-sm text-subtle">
                  You can find postings on{" "}
                  <a
                    href={`${MCF_BASE_URL}?search=${jobTitleURI}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    MyCareersFuture
                  </a>
                  ,{" "}
                  <a
                    href={`${LINKEDIN_BASE_URL}?keywords=${jobTitleURI}&geoId=${GEO_ID_SG}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>{" "}
                  or other job portals.
                </p>
                <div className="mt-5 flex flex-col space-y-6">
                  <PostingTextareas
                    numPostings={numPostings}
                    setTextareaRef={setTextareaRef}
                  />
                </div>
                <FormMessage className="mt-2" />
              </>
            )}
          />
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
