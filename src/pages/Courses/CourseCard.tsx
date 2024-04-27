import { Course } from ".";
import {
  labelApproxDuration,
  labelDuration,
  labelPrice,
  labelTrainingMode,
} from "./utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SSG_COURSE_BASE_URL } from "@/utils/constants";

interface CourseProps {
  course: Course;
  isFirst: boolean;
  isLast: boolean;
}

export default function CourseCard({ course, isFirst, isLast }: CourseProps) {
  return (
    <Card
      className="flex items-start rounded-none border-x-0 border-b-0 bg-background pb-4 pt-3.5 shadow-none last:border-b-2"
      style={{
        ...(isFirst && { borderTopStyle: "double", borderTopWidth: "6px" }),
        ...(isLast && {
          borderBottomStyle: "double",
          borderBottomWidth: "6px",
        }),
      }}
    >
      <div>
        <CardHeader className="space-y-1 p-0">
          <CardTitle className="text-base leading-snug">
            <a
              href={`${SSG_COURSE_BASE_URL}?courseReferenceNumber=${course.ref_num}`}
              target="_blank"
              rel="noreferrer"
            >
              {course.title}
            </a>
          </CardTitle>
          <CardDescription className="p-0 text-xs leading-snug text-subtle">
            {course.training_provider}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-[0.575rem] px-0 pb-0 text-xs leading-snug">
          <p>
            <Popover>
              <PopoverTrigger>${labelPrice(course.price)}</PopoverTrigger>
              <PopoverContent className="w-auto px-2.5 py-2 text-xs leading-snug">
                Full fee, excluding GST and any <br />
                available funding/subsidy
              </PopoverContent>
            </Popover>
            {course.duration > 0 &&
              `\u2002\u2022\u2002${labelDuration(course.duration)} hours`}
            {course.duration >= 35 && (
              <>
                <span> </span>
                <Popover>
                  <PopoverTrigger>
                    {course.duration > 0 && (
                      <span>{labelApproxDuration(course.duration)}</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto px-2.5 py-2 text-xs leading-snug">
                    Estimated duration
                  </PopoverContent>
                </Popover>
              </>
            )}
            {course.training_mode && (
              <span className="hidden courseSm:inline">{`\u2002\u2022\u2002${labelTrainingMode(
                course.training_mode,
              )}`}</span>
            )}
          </p>
          {course.training_mode && (
            <p className="mt-0.5 courseSm:hidden">
              {labelTrainingMode(course.training_mode)}
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
