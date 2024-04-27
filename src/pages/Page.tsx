import { forwardRef, useState } from "react";

import { useUIContext } from "@/contexts/UIContext";
import { LogItem } from "@/components/Log";
import Home from "./Home";
import JobTitle, { FormData as JobTitleFormData } from "./JobTitle";
import FetchPostings, {
  FormData as FetchPostingsFormData,
} from "./FetchPostings";
import PastePostings, {
  FormData as PastePostingsFormData,
} from "./PastePostings";
import Skills, { FormData as SkillFormData } from "./Skills";
import Courses, { Course } from "./Courses";
import { PostingOption, Steps } from "@/utils/constants";

interface PageProps {
  currStep: number;
  setCurrStep: React.Dispatch<React.SetStateAction<number>>;
  setLogItems: React.Dispatch<React.SetStateAction<LogItem[]>>;
}

export default forwardRef<HTMLDivElement, PageProps>(function Page(
  { currStep, setCurrStep, setLogItems },
  ref,
) {
  const { showBottomBar } = useUIContext();

  const [stepSeen, setStepSeen] = useState(0);
  const seenNextStep = stepSeen > currStep;

  const [jobTitle, setJobTitle] = useState("");
  const [postingOption, setPostingOption] = useState(PostingOption.None);

  const [jobTitleFormData, setJobTitleFormData] =
    useState<JobTitleFormData | null>(null);
  const [fetchPostingsFormData, setFetchPostingsFormData] =
    useState<FetchPostingsFormData | null>(null);
  const [pastePostingsFormData, setPastePostingsFormData] =
    useState<PastePostingsFormData | null>(null);
  const [skillFormData, setSkillFormData] = useState<SkillFormData | null>(
    null,
  );

  const [showCourseFilters, setShowCourseFilters] = useState(false);

  const [skillLines, setSkillLines] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const toPrevStep = () => {
    setCurrStep((s) => s - 1);
  };

  const toNextStep = () => {
    setCurrStep((s) => s + 1);
    setStepSeen((s) => Math.max(s, currStep + 1));
  };

  const toFirstStep = () => {
    setJobTitle("");
    setJobTitleFormData(null);
    setCurrStep(Steps.JobTitle);
    setStepSeen(Steps.JobTitle);
  };

  const toStep = (step: Steps) => {
    setCurrStep(step);
    setStepSeen((s) => Math.max(s, step));
  };

  let page;
  switch (currStep) {
    case Steps.Home:
      page = (
        <Home
          toNextStep={toNextStep}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          setJobTitleFormData={setJobTitleFormData}
        />
      );
      break;
    case Steps.JobTitle:
      page = (
        <JobTitle
          formData={jobTitleFormData}
          setFormData={setJobTitleFormData}
          setPostingOption={setPostingOption}
          seenNextStep={seenNextStep}
          setStepSeen={setStepSeen}
          toPrevStep={toPrevStep}
          toStep={toStep}
          setLogItems={setLogItems}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          postingOption={postingOption}
          setSkillFormData={setSkillFormData}
          setSkillLines={setSkillLines}
        />
      );
      break;
    case Steps.FetchPostings:
      page = (
        <FetchPostings
          formData={fetchPostingsFormData}
          setFormData={setFetchPostingsFormData}
          seenNextStep={seenNextStep}
          setStepSeen={setStepSeen}
          toStep={toStep}
          setLogItems={setLogItems}
          jobTitle={jobTitle}
          setSkillFormData={setSkillFormData}
          setSkillLines={setSkillLines}
        />
      );
      break;
    case Steps.PastePostings:
      page = (
        <PastePostings
          formData={pastePostingsFormData}
          setFormData={setPastePostingsFormData}
          seenNextStep={seenNextStep}
          setStepSeen={setStepSeen}
          toStep={toStep}
          setLogItems={setLogItems}
          jobTitle={jobTitle}
          setSkillFormData={setSkillFormData}
          setSkillLines={setSkillLines}
        />
      );
      break;
    case Steps.Skills:
      page = (
        <Skills
          formData={skillFormData}
          setFormData={setSkillFormData}
          skillLines={skillLines}
          seenNextStep={seenNextStep}
          toNextStep={toNextStep}
          toStep={toStep}
          setLogItems={setLogItems}
          postingOption={postingOption}
          showFilters={showCourseFilters}
          setShowFilters={setShowCourseFilters}
          setCourses={setCourses}
        />
      );
      break;
    case Steps.Courses:
      page = (
        <Courses
          courses={courses}
          toPrevStep={toPrevStep}
          toFirstStep={toFirstStep}
          setShowCourseFilters={setShowCourseFilters}
        />
      );
      break;
  }

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-screen-md px-6 pt-6 ${
        // 6.5 rem - height of bottom bar including padding and margin
        showBottomBar ? "pb-[6.5rem]" : ""
      }`}
    >
      {page}
    </div>
  );
});
