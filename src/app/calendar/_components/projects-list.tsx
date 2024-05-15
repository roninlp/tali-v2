"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Project } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AddProjectButton } from "./add-project-button";

type ProjectListProps = {
  projects: Project[];
};
export default function ProjectsList({ projects }: ProjectListProps) {
  const projectQuery = api.project.getAll.useQuery(undefined, {
    initialData: projects,
  });

  return (
    <div>
      <div>
        <AddProjectButton />
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
  const utils = api.useUtils();
  const {
    mutate: deleteProject,
    isPending,
    variables,
  } = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  const handleDeleteProject = (id: number) => {
    deleteProject({ projectId: id });
  };
  return (
    <Badge
      key={project.id}
      variant="default"
      className={cn(
        isPending && variables.projectId === project.id ? "bg-white" : "",
        "group flex items-center justify-center gap-1 py-1",
      )}
    >
      <div className="size-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteProject(project.id)}
          className="size-full"
        >
          <Cross2Icon />
        </Button>
      </div>
      {project.name}
    </Badge>
  );
}
