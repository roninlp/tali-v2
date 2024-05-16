import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type ReactNode } from "react";
import SignIn from "../_components/sign-in";
import SignOut from "../_components/sign-out";
import { ModeToggle } from "../_components/theme-toggle";
import ProjectsList from "./_components/projects-list";

const CalendarLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();
  const projects = await api.project.getAll();
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center bg-background text-foreground"
    >
      <div className="flex w-full justify-between px-16 py-8">
        <div className="flex items-center justify-center gap-4">
          {session ? <SignOut /> : <SignIn />}
          <p className="text-center text-foreground">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
        </div>
        <ModeToggle />
      </div>
      <div className="flex h-full w-full flex-grow">
        <div className="flex w-1/5  flex-col gap-4 px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>پروژه‌ها</CardTitle>
              <CardDescription>
                شما {projects.length} پروژه در دسترس دارید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsList projects={projects} />
            </CardContent>
          </Card>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CalendarLayout;
