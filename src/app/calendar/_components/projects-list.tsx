"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type ProjectType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AddProjectButton, NewProjectForm } from "./add-project-button";

type ProjectListProps = {
  projects: ProjectType[];
};
export default function ProjectsList({ projects }: ProjectListProps) {
  const projectQuery = api.project.getAll.useQuery(undefined, {
    initialData: projects,
  });

  return (
    <div className="flex min-w-32 flex-col gap-8">
      <div>
        <AddProjectButton>
          <Button variant="secondary">پروژه جدید</Button>
        </AddProjectButton>
      </div>
      <ul className="flex flex-col gap-4">
        {projectQuery?.data?.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
}

function ProjectComponent({ project }: { project: ProjectType }) {
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
        "group flex items-center justify-start gap-2 rounded-md px-2 py-2 hover:bg-secondary",
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
          >
            <div>ویرایش</div>
            <DropdownMenuShortcut>E</DropdownMenuShortcut>
          </EditProjectDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <span>{project.name}</span>
    </li>
  );
}

type EditProjectDialogProps = {
  project: ProjectType;
  children: ReactNode;
  setDropDownOpen: Dispatch<SetStateAction<boolean>>;
};

function EditProjectDialog({
  project,
  children,
  setDropDownOpen,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={() => setDropDownOpen(false)} dir="rtl">
        <NewProjectForm project={project} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
