import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import {
  endOfMonth,
  format,
  startOfMonth,
  startOfToday,
} from "date-fns-jalali";
import { unstable_noStore } from "next/cache";
import Calendar from "./_components/calendar";

const CalendarPage = async () => {
  unstable_noStore();
  const session = await getServerAuthSession();
  if (!session) return <div>not logged in</div>;
  const firstDayOfCurrentMonth = startOfToday();
  console.log(
    "🚀 ~ CalendarPage ~ firstDayOfCurrentMonth:",
    startOfMonth(firstDayOfCurrentMonth),
    format(endOfMonth(firstDayOfCurrentMonth), "yyyy-MM-dd"),
  );
  const tasks = await api.task.getAllTasks({
    startDate: startOfMonth(firstDayOfCurrentMonth),
    endDate: endOfMonth(firstDayOfCurrentMonth),
  });
  return <Calendar tasks={tasks} />;
};

export default CalendarPage;
