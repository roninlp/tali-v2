"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import {
  endOfMonth,
  format,
  startOfMonth,
  startOfToday,
} from "date-fns-jalali";

type TaskProps = {
  task: TaskType;
};

const Task = ({
  task: { name, isCompleted, projectId, id, dueDate },
}: TaskProps) => {
  const queryClient = useQueryClient();
  const utils = api.useUtils();
  const firstDayOfCurrentMonth = startOfToday();
  const dayIndex = +format(dueDate, "d");
  const update = api.task.update.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel();
      const allTasksQueryKey = getQueryKey(api.task.getAllTasks, {
        startDate: startOfMonth(firstDayOfCurrentMonth),
        endDate: endOfMonth(firstDayOfCurrentMonth),
      });
      const previousTasks = queryClient.getQueryData(allTasksQueryKey);
      console.log("🚀 ~ onMutate: ~ previousTasks:", previousTasks);

      queryClient.setQueryData(
        allTasksQueryKey,
        (oldQueryData: TaskType[][] | undefined) => {
          if (oldQueryData === undefined) return;

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

      // utils.task.getAllTasks.setData(
      //   {
      //     startDate: startOfMonth(firstDayOfCurrentMonth),
      //     endDate: endOfMonth(firstDayOfCurrentMonth),
      //   },
      //   (oldQueryData: TaskType[][] | undefined) => {
      //     if (oldQueryData === undefined) return;
      //     const newTasks = oldQueryData.map((days, index) =>
      //       index === dayIndex - 1
      //         ? [
      //             ...days,
      //             {
      //               ...newTask,
      //               isCompleted: newTask?.isCompleted ?? false,
      //             },
      //           ]
      //         : days,
      //     );
      //     console.log("🚀 ~ onMutate: ~ newTasks:", newTasks);
      //     return oldQueryData?.map((tasks) =>
      //       tasks.map((task) =>
      //         task.id === newTask.id
      //           ? {
      //               ...task,
      //               isCompleted: newTask?.isCompleted ?? false,
      //             }
      //           : task,
      //       ),
      //     );
      //   },
      // );
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
    console.log("🚀 ~ onCheckboxChange ~ e:", e);
    update.mutate({ id, isCompleted: e });
  };

  const handleDeleteTask = () => {
    deleteTask.mutate({ id });
  };
  return (
    <li
      className={cn(
        "flex items-center justify-between rounded bg-secondary px-4 py-2 text-secondary-foreground",
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
      <Button size="icon" className="size-6" onClick={handleDeleteTask}>
        <Cross2Icon />
      </Button>
    </li>
  );
};
export default Task;
