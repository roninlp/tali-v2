"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { projectListColorClassMap } from "@/data/project-colors";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  endOfMonth,
  getDay,
  startOfMonth,
  startOfToday,
} from "date-fns-jalali";

type TaskProps = {
  task: TaskType;
};

const Task = ({
  task: { name, isCompleted, projectId, id, dueDate },
}: TaskProps) => {
  const utils = api.useUtils();
  const project = utils.project.getAll
    .getData()
    ?.find((project) => project.id === projectId);

  const dayIndex = getDay(dueDate);
  const firstDayOfCurrentMonth = startOfToday();
  const update = api.task.update.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel();

      const previousTasks = utils.task.getAllTasks.getData({
        startDate: startOfMonth(firstDayOfCurrentMonth),
        endDate: endOfMonth(firstDayOfCurrentMonth),
      });

      utils.task.getAllTasks.setData(
        {
          startDate: startOfMonth(firstDayOfCurrentMonth),
          endDate: endOfMonth(firstDayOfCurrentMonth),
        },
        (oldQueryData: TaskType[][] | undefined) => {
          if (oldQueryData === undefined) return;
          const newTasks = oldQueryData.map((days, index) =>
            index === dayIndex - 1
              ? [
                  ...days,
                  {
                    ...newTask,
                    isCompleted: newTask?.isCompleted ?? false,
                  },
                ]
              : days,
          );
          return oldQueryData?.map((tasks) =>
            tasks.map((task) =>
              task.id === newTask.id
                ? {
                    ...task,
                    isCompleted: newTask?.isCompleted ?? false,
                  }
                : task,
            ),
          );
        },
      );
      return { previousTasks };
    },
    onSettled: async () => {
      await utils.task.invalidate();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSettled: async () => {
      await utils.task.invalidate();
    },
  });

  const onCheckboxChange = (e: boolean) => {
    update.mutate({ id, isCompleted: e });
  };

  const handleDeleteTask = () => {
    deleteTask.mutate({ id });
  };
  return (
    <li
      className={cn(
        "border border-r-4",
        !!project
          ? projectListColorClassMap[project.color]
          : "border-r-secondary",
        deleteTask.isPending ? "opacity-50" : "",
        "flex items-center justify-between rounded px-4 py-2 text-secondary-foreground",
      )}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          id={`task-${id}`}
          onCheckedChange={onCheckboxChange}
          checked={isCompleted}
        />
        <Label htmlFor={`task-${id}`}>{name}</Label>
      </div>
      {/* {!!project && (
        <Badge className={cn(colorClassMap[project.color], "size-5")} />
      )} */}
      <Button
        size="icon"
        variant="outline"
        className="size-6"
        onClick={handleDeleteTask}
      >
        <Cross2Icon />
      </Button>
    </li>
  );
};
export default Task;
