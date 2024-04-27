import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUIContext } from "@/contexts/UIContext";
import DurationSlider from "./DurationSlider";
import PriceSlider from "./PriceSlider";
import SkillCheckboxes from "./SkillCheckboxes";
import TrainingModeCheckboxes from "./TrainingModeCheckboxes";
import MidCareerSwitch from "./MidCareerSwitch";
import { LogItem } from "@/components/Log";
import NavBar from "@/components/NavBar";
import PrevButton from "@/components/PrevButton";
import NextButton from "@/components/NextButton";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import useContentHeight from "@/hooks/useContentHeight";
import useLog from "@/hooks/useLog";
import { Course } from "@/pages/Courses";
import {
  PRICES,
  PRICE_LABELS,
  DURATIONS,
  DURATION_LABELS,
  PostingOption,
  Steps,
} from "@/utils/constants";

export interface FormData {
  lineIndexes: number[];
  priceRange: number[];
  durationRange: number[];
  partTime: boolean;
  fullTime: boolean;
  trainingModeValid: boolean;
  sfcMidCareer: boolean;
}

const formSchema = z
  .object({
    lineIndexes: z
      .array(z.number())
      .refine((value) => value.length > 0, "Select at least 1 skill."),
    priceRange: z.array(z.number()),
    durationRange: z.array(z.number()),
    partTime: z.boolean(),
    fullTime: z.boolean(),
    trainingModeValid: z.boolean(),
    sfcMidCareer: z.boolean(),
  })
  .refine((data) => data.trainingModeValid, {
    message: "Select at least 1 mode.",
    path: ["trainingModeValid"],
  });

interface SkillsProps {
  formData: FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  skillLines: string[];
  seenNextStep: boolean;
  toNextStep: () => void;
  toStep: (value: number) => void;
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>;
  postingOption: PostingOption;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export default function Skills({
  formData,
  setFormData,
  skillLines,
  seenNextStep,
  toNextStep,
  toStep,
  setLogItems,
  postingOption,
  showFilters,
  setShowFilters,
  setCourses,
}: SkillsProps) {
  const { setLoading, setErrored } = useUIContext();
  const { logError } = useLog(setLogItems);

  const form = useForm<FormData>({
    defaultValues: formData || {
      lineIndexes: skillLines.map((_, index) => index).slice(0, 3),
      priceRange: [0, PRICE_LABELS.length - 1],
      durationRange: [0, DURATION_LABELS.length - 1],
      partTime: true,
      fullTime: true,
      trainingModeValid: true,
      sfcMidCareer: false,
    },
    resolver: zodResolver(formSchema),
  });

  const [selectAll, setSelectAll] = useState(
    (formData
      ? formData.lineIndexes.length
      : form.getValues("lineIndexes").length) === skillLines.length,
  );

  const watchPartTime = form.watch("partTime");
  const watchFullTime = form.watch("fullTime");
  const trainingModeValid = watchPartTime || watchFullTime;

  useEffect(() => {
    form.setValue("trainingModeValid", trainingModeValid, {
      shouldDirty: true,
    });
    if (trainingModeValid) {
      form.clearErrors("trainingModeValid");
    } else if (form.formState.isSubmitted) {
      form.setError("trainingModeValid", {
        message: "Select at least 1 mode.",
      });
    }
  }, [trainingModeValid, form]);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const sessionID = sessionStorage.getItem("sessionID");
    setFormData(data);

    const selectedLines = data.lineIndexes.map(
      (index: number) => skillLines[index],
    );

    const [minPriceIndex, maxPriceIndex] = data.priceRange;
    const minPrice = PRICES[minPriceIndex];
    const maxPrice =
      maxPriceIndex < PRICES.length ? PRICES[maxPriceIndex] : null;

    const [minDurationIndex, maxDurationIndex] = data.durationRange;
    const minDuration = DURATIONS[minDurationIndex];
    const maxDuration =
      maxDurationIndex < DURATIONS.length ? DURATIONS[maxDurationIndex] : null;

    fetch(`${import.meta.env.VITE_SERVER_URL}/find-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": sessionID || "",
      },
      body: JSON.stringify({
        query: selectedLines.join("\n"),
        minPrice: minPrice,
        maxPrice: maxPrice,
        minDuration: minDuration,
        maxDuration: maxDuration,
        partTime: data.partTime,
        fullTime: data.fullTime,
        sfcMidCareer: data.sfcMidCareer,
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
      .then((courses) => {
        setCourses(courses);
        toNextStep();
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
        <div ref={contentRef}>
          {!showFilters && (
            <>
              <SkillCheckboxes
                skillLines={skillLines}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
              />
              <p className="mt-5 text-xs italic leading-snug text-subtle">
                <span className="font-semibold">Disclaimer:</span> This list of
                skills is provided for informational purposes only. It was
                generated by AI and may contain errors or inaccuracies.
              </p>
            </>
          )}
          {showFilters && (
            <>
              <p>Filter the course results:</p>
              <div className="mt-6 space-y-3.5">
                <FormLabel>Price (full fee)</FormLabel>
                <PriceSlider />
              </div>
              <div className="mt-7 space-y-3.5">
                <FormLabel>Duration</FormLabel>
                <DurationSlider />
              </div>
              <TrainingModeCheckboxes />
              <div className="mt-6 space-y-2.5">
                <p className="text-sm font-semibold">Filters</p>
                <MidCareerSwitch />
              </div>
            </>
          )}
        </div>
        <NavBar>
          <PrevButton
            onClick={() => {
              if (showFilters) {
                setShowFilters(false);
              } else {
                switch (postingOption) {
                  case PostingOption.None:
                    toStep(Steps.JobTitle);
                    break;
                  case PostingOption.Fetch:
                    toStep(Steps.FetchPostings);
                    break;
                  case PostingOption.Paste:
                    toStep(Steps.PastePostings);
                    break;
                }
              }
            }}
          />
          {showFilters ? (
            <Button className="min-w-0 flex-grow" type="submit">
              Find courses
            </Button>
          ) : (
            <Button
              className="min-w-0 flex-grow"
              type="button"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setShowFilters(true);
              }}
            >
              Filter courses
            </Button>
          )}
          {showFilters && seenNextStep && (
            <NextButton
              onClick={toNextStep}
              formIsDirty={form.formState.isDirty}
            />
          )}
        </NavBar>
      </form>
    </Form>
  );
}
