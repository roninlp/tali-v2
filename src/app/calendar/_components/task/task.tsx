"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { colorClassMap } from "@/data/project-colors";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { cn } from "@/lib/utils";
import { type TaskType } from "@/server/db/schema";
import { useMonthDateState } from "@/state/current-month";
import { api } from "@/trpc/react";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const { name, isCompleted, projectId, id, dueDate } = task;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: task,
  });

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
      ref={setNodeRef}
      className={cn(
        !!project && colorClassMap[project.color],
        deleteTask.isPending ? "opacity-50" : "",
        "group/task flex items-center justify-between rounded px-2 py-1 text-secondary-foreground",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn("ml-2", isDragging ? "cursor-grabbing" : "cursor-grab")}
      >
        <HamburgerMenuIcon className="size-3" />
      </div>
      <div className="flex flex-1 items-center gap-2">
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
        className="hidden aspect-square size-5 group-hover/task:flex"
        onClick={handleDeleteTask}
      >
        <Cross2Icon className="size-3" />
      </Button>
    </li>
  );
};
export default Task;
