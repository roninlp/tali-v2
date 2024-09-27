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
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex w-full items-center justify-between px-8 py-6 md:px-16">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">تالی</h1>
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <p>
                {" "}
                <span className="font-bold">{session.user.name}</span> خوش آمدید
              </p>
              <SignOut />
            </>
          ) : (
            <SignIn />
          )}

          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-8 py-16 md:flex-row-reverse">
        <div className="mb-12 text-right md:mb-0 md:w-1/2 md:pl-12">
          <h2 className="mb-6 text-5xl leading-tight">
            مدیریت پروژه‌ها به آسانی با{" "}
            <span className="font-bold text-primary">تالی</span>
          </h2>
          <p className="mb-8 text-xl">
            تالی راهکار همه‌کاره مدیریت پروژه بر پایه تقویم است. وظایف را
            ساده‌سازی کنید، به راحتی همکاری کنید و از مهلت‌های خود عقب نمانید.
          </p>
          <div className="flex justify-end space-x-4">
            <Link
              href="/"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              شروع کنید
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="mb-4 text-right text-2xl font-semibold">
                ویژگی‌های کلیدی
              </h3>
              <ul className="space-y-2 text-right">
                <li className="flex items-center justify-end">
                  رابط کاربری تقویم بصری
                  <svg
                    className="mr-2 h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </li>
                <li className="flex items-center justify-end">
                  مدیریت و پیگیری وظایف
                  <svg
                    className="mr-2 h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </li>
                <li className="flex items-center justify-end">
                  ابزارهای همکاری تیمی
                  <svg
                    className="mr-2 h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </li>
                <li className="flex items-center justify-end">
                  گردش کارهای قابل سفارشی‌سازی
                  <svg
                    className="mr-2 h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="w-full bg-secondary py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 md:flex-row">
          <p className="text-right">تمامی حقوق محفوظ است © ۱۴۰۳ تالی</p>
        </div>
      </footer>
    </main>
  );
}
