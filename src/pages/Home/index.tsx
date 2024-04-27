import { useForm } from "react-hook-form";

import { useUIContext } from "@/contexts/UIContext";
import JobTitleInput from "./JobTitleInput";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { Form } from "@/components/ui/form";
import { FormData as JobTitleFormData } from "@/pages/JobTitle";

interface FormData {
  jobTitle: string;
}

interface HomeProps {
  toNextStep: () => void;
  jobTitle: string;
  setJobTitle: React.Dispatch<React.SetStateAction<string>>;
  setJobTitleFormData: React.Dispatch<
    React.SetStateAction<JobTitleFormData | null>
  >;
}

export default function Home({ toNextStep, jobTitle, setJobTitle }: HomeProps) {
  const { theme } = useUIContext();

  const form = useForm<FormData>({
    defaultValues: {
      jobTitle: jobTitle || "",
    },
  });

  const onSubmit = () => {
    setJobTitle(form.watch("jobTitle"));
    toNextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-8 flex flex-col items-center homeSm:mt-1 homeSm:flex-row">
          <div className="w-[130px] flex-shrink-0 homeSm:w-[25%]">
            <img
              className="aspect-[176 / 163]"
              src={theme === "light" ? logoLight : logoDark}
            />
          </div>
          <div className="h-4 flex-shrink-0 homeSm:w-9"></div>
          <p className="text-2xl font-semibold">
            Discover SkillsFuture courses aligned to your aspirations
          </p>
        </div>
        <JobTitleInput />
        <h2 className="mt-8 text-lg font-semibold">What happens next?</h2>
        <ol className="mt-2.5 list-inside list-decimal space-y-2.5">
          <li>AI extracts in-demand skills from real job postings.</li>
          <li>Choose the skills you'd like to learn or improve.</li>
          <li>You get a list of courses to explore.</li>
        </ol>
        <p className="my-8 text-sm italic text-subtle">
          This website is an independent project and not affiliated with the
          Singapore Government.
        </p>
      </form>
    </Form>
  );
}
