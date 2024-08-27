"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { projectListColorClassMap } from "@/data/project-colors";
import { cn } from "@/lib/utils";
import { ProjectType, TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { EditProjectDialog } from "./edit-project-dialog";

type ProjectComponentProps = {
  project: ProjectType;
  tasks: TaskType[] | undefined;
};

export function ProjectComponent({ project, tasks }: ProjectComponentProps) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const utils = api.useUtils();

  const {
    mutate: deleteProject,
    isPending: isDeletePending,
    variables: deleteVariables,
  } = api.project.delete.useMutation({
    onMutate: () => {
      setDropDownOpen(false);
    },
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      await utils.task.invalidate();
    },
  });

  const handleDeleteProject = () => {
    deleteProject({ projectId: project.id });
  };

  return (
    <li
      key={project.id}
      className={cn(
        isDeletePending && deleteVariables.projectId === project.id
          ? "bg-muted text-muted-foreground"
          : "",
        "border border-r-4",
        projectListColorClassMap[project.color],
        "group relative flex items-center justify-start gap-2 rounded-md px-2 py-2 transition-all hover:bg-secondary",
        !!tasks && tasks?.length > 0 ? "hover:pb-4" : "",
      )}
    >
      <DropdownMenu
        dir="rtl"
        open={dropDownOpen}
        onOpenChange={setDropDownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isDeletePending}
            variant="ghost"
            size="icon"
            className="size-5"
          >
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={() => setShowConfirmDelete(false)}
          className="w-[160px]"
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {showConfirmDelete ? (
              <div className="flex w-full justify-between">
                <Button
                  onClick={handleDeleteProject}
                  variant="destructive"
                  size="sm"
                >
                  حذف؟
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  لغو
                </Button>
              </div>
            ) : (
              <div
                className="flex w-full justify-between"
                onClick={() => setShowConfirmDelete(true)}
              >
                حذف
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </div>
            )}
          </DropdownMenuItem>
          <EditProjectDialog
            setDropDownOpen={setDropDownOpen}
            project={project}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex w-full justify-between gap-3">
        <span>{project.name}</span>
        {!!tasks && tasks?.length > 0 ? (
          <span className="pl-2">
            {tasks?.filter((task) => task.isCompleted).length}/{tasks?.length}
          </span>
        ) : null}
      </div>
      {!!tasks && tasks?.length > 0 ? (
        <Progress
          className="absolute bottom-0 right-0 hidden w-[100%] group-hover:block"
          value={
            (tasks?.filter((task) => task.isCompleted).length * 100) /
            tasks?.length
          }
        />
      ) : null}
    </li>
  );
}
