"use client";
import { Badge } from "@/components/ui/badge";
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
import { type Project } from "@/server/db/schema";
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
  projects: Project[];
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
      <div className="flex flex-wrap gap-2">
        {projectQuery?.data?.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectComponent({ project }: { project: Project }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const utils = api.useUtils();
  const {
    mutate: deleteProject,
    isPending: isDeletePending,
    variables: deleteVariables,
  } = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  const handleDeleteProject = () => {
    deleteProject({ projectId: project.id });
  };

  return (
    <Badge
      key={project.id}
      variant="default"
      className={cn(
        isDeletePending && deleteVariables.projectId === project.id
          ? "bg-white"
          : "",
        "group flex items-center justify-center gap-1 py-1",
      )}
    >
      <DropdownMenu
        dir="rtl"
        open={dropDownOpen}
        onOpenChange={setDropDownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-5">
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
      {project.name}
    </Badge>
  );
}

type EditProjectDialogProps = {
  project: Project;
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
      <DialogContent dir="rtl">
        <NewProjectForm
          project={project}
          setOpen={setOpen}
          setDropDownOpen={setDropDownOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
