"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { endOfMonth, startOfMonth, startOfToday } from "date-fns-jalali";

type TaskProps = {
  task: TaskType;
};

const Task = ({
  task: { name, isCompleted, projectId, id, dueDate },
}: TaskProps) => {
  const utils = api.useUtils();
  const firstDayOfCurrentMonth = startOfToday();
  const mutate = api.task.update.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel();
      const previousTasks = utils.task.getAllTasks.getData();
      if (previousTasks === undefined) return;

      utils.task.getAllTasks.setData(
        {
          startDate: startOfMonth(firstDayOfCurrentMonth),
          endDate: endOfMonth(firstDayOfCurrentMonth),
        },
        (oldQueryData: TaskType[][] | undefined) => {
          console.time("time");
          console.timeLog("time");
          const updatedTasks = oldQueryData?.map((tasks) =>
            tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    ...newTask,
                  }
                : task,
            ),
          );
          console.timeEnd("time");
          return updatedTasks ?? [];
        },
      );
    },
    onSettled: async () => {
      await utils.task.invalidate();
    },
  });

  const onCheckboxChange = (e: boolean) => {
    mutate.mutate({ id, isCompleted: e });
  };
  return (
    <li
      className={cn(
        "flex items-center gap-2 rounded bg-secondary px-4 py-1 text-secondary-foreground",
      )}
    >
      <Checkbox
        id={`task-${id}`}
        onCheckedChange={onCheckboxChange}
        checked={isCompleted}
      />
      <Label htmlFor={`task-${id}`}>{name}</Label>
    </li>
  );
};
export default Task;
