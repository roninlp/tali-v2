"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import {
  format,
  getDate,
  isEqual,
  isSameMonth,
  isToday,
} from "date-fns-jalali";
import Task from "./task/task";
import { useDroppable } from "@dnd-kit/core";
import { Draggable } from "@/components/draggable";

type DayProps = {
  tasks: TaskType[] | undefined;
  day: Date;
  selectedDay: Date;
  firstDayOfCurrentMonth: Date;
  isPending: boolean;
};

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  tasks,
  isPending,
}: DayProps) {
  const dayIndex = getDate(day);
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${dayIndex}`,
    data: day,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn("h-full w-full", isOver ? "bg-primary/10" : "")}
    >
      <div
        className={cn(
          isEqual(day, selectedDay) && "text-secondary-foreground",
          !isEqual(day, selectedDay) && isToday(day) && "text-primary",
          !isEqual(day, selectedDay) && !isToday(day) && "text-foreground",
          !isEqual(day, selectedDay) &&
            !isToday(day) &&
            isSameMonth(day, firstDayOfCurrentMonth) &&
            "text-foreground",
          isEqual(day, selectedDay) &&
            isToday(day) &&
            "bg-primary text-primary-foreground",
          isEqual(day, selectedDay) && !isToday(day) && "bg-accent",
          !isEqual(day, selectedDay) && "group-hover:bg-muted",
          (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
          "flex size-6 items-center justify-center rounded-full text-sm",
        )}
      >
        <time className="font-vazir" dateTime={format(day, "yyyy-MM-dd")}>
          {format(day, "d")}
        </time>
      </div>
      {isPending ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <ul className="relative flex w-full shrink flex-col gap-1">
          {tasks?.map((task) => {
            return <Task key={task.id} task={task} />;
          })}
        </ul>
      )}
    </div>
  );
}
