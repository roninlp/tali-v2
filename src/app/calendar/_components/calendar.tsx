"use client";

import { Button } from "@/components/ui/button";
import { colStartClasses, weekDays } from "@/data/calendar-data";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { cn } from "@/lib/utils";
import { useMonthActions, useMonthState } from "@/state/current-month";
import { api } from "@/trpc/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns-jalali";
import { useState } from "react";
import Day from "./day";
import { AddTaskButton } from "./task/add-task-button";

export default function Calendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const currentMonth = useMonthState();
  const { incrementMonth, decrementMonth } = useMonthActions();

  const firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayOfCurrentMonth,
    end: endOfMonth(firstDayOfCurrentMonth),
  });

  const { data: allTasks, isPending } = api.task.getAllTasks.useQuery(
    getStartAndEndOfMonth(firstDayOfCurrentMonth),
    {
      staleTime: 30 * 1000,
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
          <Button onClick={decrementMonth} variant="ghost" size="icon">
            <span className="sr-only">ماه قبل</span>
            <ChevronRightIcon />
          </Button>
          <Button onClick={incrementMonth} variant="ghost" size="icon">
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
              tasks={!!allTasks ? allTasks[dayIndex] : []}
              day={day}
              selectedDay={selectedDay}
              firstDayOfCurrentMonth={firstDayOfCurrentMonth}
              isPending={isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
