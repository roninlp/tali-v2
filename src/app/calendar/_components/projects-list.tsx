"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectListColorClassMap } from "@/data/project-colors";
import { cn } from "@/lib/utils";
import { TaskType, type ProjectType } from "@/server/db/schema";
import { useMonthDateState } from "@/state/current-month";
import { api } from "@/trpc/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState, type Dispatch, type SetStateAction } from "react";
import { AddProjectButton, NewProjectForm } from "./add-project-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { Progress } from "@/components/ui/progress";


export default function ProjectsList() {
  const currentMonth = useMonthDateState();
  const { data, isPending } = api.project.getAll.useQuery(undefined, {
    staleTime: Infinity,
  });
  const { data: allTasks } = api.task.getAllTasks.useQuery(getStartAndEndOfMonth(currentMonth))

  return (
    <Card>
      <CardHeader>
        <CardTitle>پروژه‌ها</CardTitle>
        {isPending ? <Skeleton className="h-10 w-full" /> :
          <CardDescription>
            {data?.length} پروژه
          </CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex min-w-32 flex-col gap-8">
          <div>
            <AddProjectButton>
              <Button variant="secondary">پروژه جدید</Button>
            </AddProjectButton>
          </div>
          <ul className="flex flex-col gap-4">
            {data?.map((project) => (
              <ProjectComponent key={project.id} project={project} tasks={allTasks?.flat().filter(task => task.projectId === project.id)} />
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

type ProjectComponentProps = {
  project: ProjectType;
  tasks: TaskType[] | undefined
};

function ProjectComponent({ project, tasks }: ProjectComponentProps) {
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
        !!tasks && tasks?.length > 0 ? "hover:pb-4" : ""
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
      <div className="flex w-full gap-3 justify-between">
        <span>{project.name}</span>
        {!!tasks && tasks?.length > 0 ?
          <span className="pl-2">
            {tasks?.filter(task => task.isCompleted).length}/{tasks?.length}
          </span>
          : null
        }
      </div>
      {!!tasks && tasks?.length > 0 ?
        <Progress className="hidden group-hover:block absolute w-[100%] bottom-0 right-0" value={tasks?.filter(task => task.isCompleted).length * 100 / tasks?.length} />
        : null
      }
    </li>
  );
}

type EditProjectDialogProps = {
  project: ProjectType;
  setDropDownOpen: Dispatch<SetStateAction<boolean>>;
};

function EditProjectDialog({
  project,
  setDropDownOpen,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div>ویرایش</div>
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={() => setDropDownOpen(false)} dir="rtl">
        <DialogHeader>
          <DialogTitle>ویرایش پروژه</DialogTitle>
          <DialogDescription>skdfhksd</DialogDescription>
        </DialogHeader>
        <NewProjectForm project={project} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
