import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import SignIn from "./_components/sign-in";
import SignOut from "./_components/sign-out";
import { ModeToggle } from "./_components/theme-toggle";
import { DayPicker } from "react-day-picker";
import { DatePicker } from "@/components/date-picker";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="min-h-screen flex-col flex items-center bg-background text-foreground">
      <div className="flex w-full justify-between px-16 py-8">
        <div className="flex items-center justify-center gap-4">
          {session ? <SignOut /> : <SignIn />}
          <p className="text-center text-foreground">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
        </div>
        <ModeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-7xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="bg-gradient-to-bl from-[#5c6cf7] to-[#ab28f7] bg-clip-text text-transparent">
            TaLi
          </span>{" "}
          App
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-foreground">
            Project Management and Planning
          </p>
          <Link
            className={buttonVariants({ variant: "default" })}
            href={"/calendar"}
          >
            !شروع کن
          </Link>
        </div>
      </div>
      <div className="container grid grid-cols-3 gap-2">
        <Card className="col-span-2">
          <CardContent>hello</CardContent>
        </Card>

        <DatePicker />

        <Card>
          <CardContent>hello</CardContent>
        </Card>
        <Card className="col-span-3 ">
          <CardContent>hello</CardContent>
        </Card>
        <Card>
          <CardContent>hello</CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent>hello</CardContent>
        </Card>
      </div>
    </main>
  );
}
