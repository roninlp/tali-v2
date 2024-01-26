import { cn } from "@/lib/utils";
import { format, isEqual, isSameMonth, isToday } from "date-fns-jalali";

type DayProps = {
  day: Date;
  selectedDay: Date;
  firstDayOfCurrentMonth: Date;
};

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
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
      <div className="relative flex w-full shrink flex-col gap-1"></div>
    </>
  );
}
