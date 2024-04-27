import CourseCard from "./CourseCard";
import Icon from "@/components/Icon";
import NavBar from "@/components/NavBar";
import PrevButton from "@/components/PrevButton";
import { Button } from "@/components/ui/button";
import useContentHeight from "@/hooks/useContentHeight";
import { ODL_ACCESS_DATE, ODL_URL } from "@/utils/constants";

export interface Course {
  ref_num: string;
  price: number;
  duration: number;
  training_mode: string;
  title: string;
  training_provider: string;
  score: number;
}

interface CoursesProps {
  courses: Course[];
  toPrevStep: () => void;
  toFirstStep: () => void;
  setShowCourseFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Courses({
  courses,
  toPrevStep,
  toFirstStep,
  setShowCourseFilters,
}: CoursesProps) {
  const contentRef = useContentHeight();

  return (
    <>
      <div ref={contentRef}>
        <p>We found these SkillsFuture courses that might be relevant:</p>
        <p className="mt-2.5 text-xs italic leading-snug text-subtle">
          <span className="font-semibold">Data attribution:</span> This webpage
          contains information accessed on <span>{ODL_ACCESS_DATE}</span> from
          SSG's Retrieve Courses API which is made available under the terms of
          the{" "}
          <a href={ODL_URL} target="_blank" rel="noreferrer">
            Singapore Open Data Licence version 1.0.
          </a>
        </p>
        <div className="mt-6">
          {courses.map((course, index) => (
            <CourseCard
              course={course}
              key={course.ref_num}
              isFirst={index === 0}
              isLast={index === courses.length - 1}
            />
          ))}
        </div>
        <p className="mt-4 text-xs italic leading-snug text-subtle">
          <span className="font-semibold">Disclaimer:</span> No endorsement of
          any courses or training providers is implied. We do not guarantee the
          completeness or accuracy of information on this webpage.
        </p>
      </div>
      <NavBar>
        <PrevButton
          onClick={() => {
            setShowCourseFilters(true);
            toPrevStep();
          }}
        />
        <div className="flex-grow"></div>
        <Button
          variant="destructive"
          size="icon"
          title="Restart"
          type="button"
          onClick={toFirstStep}
        >
          <Icon type="restart" />
        </Button>
      </NavBar>
    </>
  );
}
