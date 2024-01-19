import { Card, CardContent } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import SignIn from "./_components/sign-in";
import SignOut from "./_components/sign-out";
import { ModeToggle } from "./_components/theme-toggle";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
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

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-foreground">
            Project Management and Planning
          </p>
        </div>
      </div>
      <div className="container grid grid-cols-3 gap-2">
        <Card className="col-span-2">
          <CardContent>hello</CardContent>
        </Card>
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
