"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { useMonthDateState } from "@/state/current-month";
import { api } from "@/trpc/react";
import { AddProjectButton } from "./add-project-button";
import { ProjectComponent } from "./project";

export default function ProjectsList() {
  const currentMonth = useMonthDateState();
  const { data, isPending } = api.project.getAll.useQuery(undefined, {
    staleTime: Infinity,
  });
  const { data: allTasks } = api.task.getAllTasks.useQuery(
    getStartAndEndOfMonth(currentMonth),
  );

  const projectLength =
    allTasks &&
    data?.filter(
      (project) =>
        allTasks?.flat().filter((task) => task.projectId === project.id)
          ?.length > 0,
    ).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>پروژه‌ها</CardTitle>
        {isPending ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <CardDescription>
            {projectLength && projectLength > 0
              ? `${projectLength} پروژه`
              : "هیچ پروژه ای وجود ندارد"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex min-w-32 flex-col gap-8">
          <div>
            <AddProjectButton>
              <Button variant="secondary">پروژه جدید</Button>
            </AddProjectButton>
          </div>
          <ul className="flex flex-col gap-4">
            {data?.map((project) => {
              const projectsTasks = allTasks
                ?.flat()
                .filter((task) => task.projectId === project.id);
              return projectsTasks && projectsTasks?.length > 0 ? (
                <ProjectComponent
                  key={project.id}
                  project={project}
                  tasks={projectsTasks}
                />
              ) : null;
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
