"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { projectListColorClassMap } from "@/data/project-colors";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { useMonthDateState } from "@/state/current-month";
import { api } from "@/trpc/react";
import { Cross2Icon } from "@radix-ui/react-icons";

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
  const currentMonthDate = useMonthDateState();
  const startAndEndOfCurrentMonth = getStartAndEndOfMonth(currentMonthDate);

  const update = api.task.update.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel(startAndEndOfCurrentMonth);

      const previousTasks = utils.task.getAllTasks.getData(
        startAndEndOfCurrentMonth,
      );

      utils.task.getAllTasks.setData(
        startAndEndOfCurrentMonth,
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
        "flex items-center justify-between rounded px-2 py-1 text-secondary-foreground",
      )}
    >
      <div className="flex w-full items-center gap-2">
        <Checkbox
          id={`task-${id}`}
          onCheckedChange={onCheckboxChange}
          checked={isCompleted}
        />
        <Label htmlFor={`task-${id}`} className="w-full pt-1 text-sm">
          {name}
        </Label>
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
