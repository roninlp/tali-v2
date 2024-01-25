import { getServerAuthSession } from "@/server/auth";
import { type ReactNode } from "react";
import SignIn from "../_components/sign-in";
import SignOut from "../_components/sign-out";
import { ModeToggle } from "../_components/theme-toggle";

const CalendarLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();
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
      {children}
    </div>
  );
};

export default CalendarLayout;
