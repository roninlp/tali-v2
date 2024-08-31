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
  getDate,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns-jalali";
import { useState } from "react";
import Day from "./day";
import { AddTaskButton } from "./task/add-task-button";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  useDraggingActions,
  useDraggingTask,
  useIsDraggingTask,
} from "@/state/dragging-task";
import { TaskType } from "@/server/db/schema";
import Task from "./task/task";

export default function Calendar() {
  const utils = api.useUtils();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const currentMonth = useMonthState();
  const { incrementMonth, decrementMonth } = useMonthActions();
  const draggingTask = useDraggingTask();
  const isDragging = useIsDraggingTask();
  const { handleDragEnd, handleDragStart } = useDraggingActions();

  const firstDayOfCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const monthObj = getStartAndEndOfMonth(firstDayOfCurrentMonth);
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

  const update = api.task.update.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel(monthObj);

      const previousTasks = utils.task.getAllTasks.getData(monthObj);
      utils.task.getAllTasks.setData(
        monthObj,
        (oldQueryData: TaskType[][] | undefined) => {
          if (oldQueryData === undefined) return;

          const taskToUpdate = oldQueryData
            .flat()
            .find((i) => i.id === newTask.id)!;
          const fromIndex = getDate(taskToUpdate.dueDate) - 1;
          const newDueDate = newTask?.dueDate!;
          const toIndex = getDate(newDueDate) - 1;
          const taskIndex = oldQueryData[fromIndex]?.findIndex(
            (task) => task.id === newTask.id,
          )!;

          const [t] = oldQueryData[fromIndex]?.splice(
            taskIndex,
            1,
          ) as TaskType[];
          if (!!t && oldQueryData[toIndex]) oldQueryData[toIndex].push(t);
          return oldQueryData;
        },
      );
      return { previousTasks };
    },
    onSettled: async () => {
      await utils.task.invalidate();
    },
  });

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
      <DndContext
        onDragStart={(e) => {
          if (e.active.data.current) {
            handleDragStart(e.active.data.current as TaskType);
          }
        }}
        onDragEnd={(e) => {
          const overDate = e.over?.data.current as Date;

          if (!isSameDay(overDate, draggingTask?.dueDate!)) {
            update.mutate({
              id: e.active.id as number,
              dueDate: e.over?.data.current as Date,
            });
          }
          handleDragEnd();
        }}
      >
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
        <DragOverlay>
          {isDragging && draggingTask ? <Task task={draggingTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
