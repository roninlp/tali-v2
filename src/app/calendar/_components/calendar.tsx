"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
} from "date-fns-jalali";
import { useState } from "react";
import { AddTaskButton } from "./add-task-button";
import Day from "./day";

export default function Calendar({ tasks }: { tasks: TaskType[][] }) {
  // unstable_noStore();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));

  const firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayOfCurrentMonth,
    end: endOfMonth(firstDayOfCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayOfCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const { data: allTasks } = api.task.getAllTasks.useQuery(
    {
      startDate: startOfMonth(firstDayOfCurrentMonth),
      endDate: endOfMonth(firstDayOfCurrentMonth),
    },
    {
      initialData: tasks,
    },
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-2 px-8">
        <h2 className="flex-auto px-8 text-3xl text-foreground">
          <span className="font-bold">
            {format(firstDayOfCurrentMonth, "MMMM ")}
          </span>
          <span>{format(firstDayOfCurrentMonth, "yyyy")}</span>
        </h2>

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
            <AddTaskButton day={day} />
            <Day
              tasks={allTasks[dayIndex]}
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
