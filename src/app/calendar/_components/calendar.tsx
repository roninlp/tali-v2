"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Project } from "@/server/db/schema";
import { api } from "@/trpc/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns-jalali";
import { useState } from "react";
import { AddProjectButton } from "./add-project-button";
import Day from "./day";

type CalenderProps = {
  projects: Project[];
};

export default function Calendar({ projects }: CalenderProps) {
  // unstable_noStore();
  const utils = api.useUtils();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));

  const firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const projectQuery = api.project.getAll.useQuery(undefined, {
    initialData: projects,
  });
  // const projectQueryKey = getQueryKey(api.project.create);

  // const projectVariables = useMutationState<string>({
  //   filters: { mutationKey: projectQueryKey, status: "pending" },
  //   select: (mutation) => mutation.state.data,
  // });

  const {
    mutate: deleteProject,
    isPending,
    variables,
  } = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  const handleDeleteProject = (id: number) => {
    deleteProject({ projectId: id });
  };

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayOfCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  return (
    <div className="mx-auto flex h-full w-full flex-grow flex-col">
      <div className="flex items-center gap-2 px-8">
        <h2 className="flex-auto px-8 text-3xl text-foreground">
          <span className="font-bold">
            {format(firstDayOfCurrentMonth, "MMMM ")}
          </span>
          <span>{format(firstDayOfCurrentMonth, "yyyy")}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {projectQuery?.data?.map((project) => (
            <Badge
              key={project.id}
              variant="default"
              className={cn(
                isPending && variables.projectId === project.id
                  ? "bg-white"
                  : "",
                "group flex items-center justify-center gap-1 py-1",
              )}
            >
              <div className="size-4">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteProject(project.id)}
                  className="size-full scale-0 transition-all ease-in-out group-hover:scale-100"
                >
                  <Cross2Icon />
                </Button>
              </div>
              {project.name}
            </Badge>
          ))}
        </div>
        <div>
          <AddProjectButton />
        </div>
        <div className="flex">
          <Button onClick={previousMonth} variant="ghost" size="icon">
            <span className="sr-only">ماه قبل</span>
            <ChevronRightIcon />
          </Button>
          <Button onClick={nextMonth} variant="ghost" size="icon">
            <span className="sr-only">ماه قبل</span>
            <ChevronLeftIcon />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b pt-10 text-center text-lg leading-6 text-foreground">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="pb-2 font-semibold">
            {weekDay}
          </div>
        ))}
      </div>
      <div className="grid flex-grow auto-rows-fr grid-cols-7 gap-0 text-sm">
        {days.map((day, dayIndex) => (
          <div
            key={day.toString()}
            onClick={() => setSelectedDay(day)}
            className={cn(
              dayIndex === 0 && colStartClasses[getDay(day)],
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                !isSameMonth(day, firstDayOfCurrentMonth) &&
                "opacity-30",
              isToday(day) && "bg-primary/10",
              "group relative flex flex-col items-start gap-1 overflow-clip border-b p-1",
            )}
          >
            <Button
              variant="default"
              size="icon"
              className={cn(
                "group/btn absolute bottom-1 left-1 scale-0 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out group-hover:flex group-hover:scale-100",
              )}
            >
              <PlusIcon className="size-5 scale-100 transition-all group-hover/btn:scale-125" />
            </Button>
            <Day
              day={day}
              selectedDay={selectedDay}
              firstDayOfCurrentMonth={firstDayOfCurrentMonth}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const colStartClasses = [
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
  "",
];
const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
