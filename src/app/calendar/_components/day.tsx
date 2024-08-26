import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { format, isEqual, isSameMonth, isToday } from "date-fns-jalali";
import Task from "./task";
import { Skeleton } from "@/components/ui/skeleton";

type DayProps = {
  tasks: TaskType[] | undefined;
  day: Date;
  selectedDay: Date;
  firstDayOfCurrentMonth: Date;
  isPending: boolean
};

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  tasks,
  isPending
}: DayProps) {
  return (
    <>
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
      {isPending ? <Skeleton className="h-8 w-full" /> :
        <ul className="relative flex w-full shrink flex-col gap-1">
          {tasks?.map((task) => <Task key={task.id} task={task} />)}
        </ul>
      }
    </>
  );
}
