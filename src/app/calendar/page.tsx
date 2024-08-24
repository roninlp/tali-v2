import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { endOfMonth, getMonth, getWeeksInMonth, startOfMonth, startOfToday, subDays } from "date-fns-jalali";
import Calendar from "./_components/calendar";

const CalendarPage = async () => {
  const session = await getServerAuthSession();
  if (!session) return <div>not logged in</div>;
  const today = startOfToday();

  const tasks = await api.task.getAllTasks({
    startDate: startOfMonth(today),
    endDate: endOfMonth(today),
  });
  return <Calendar tasks={tasks} />;
};

export default CalendarPage;
