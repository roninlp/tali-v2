import { getServerAuthSession } from "@/server/auth";
import Calendar from "./_components/calendar";

const CalendarPage = async () => {
  const session = await getServerAuthSession();
  if (!session) return <div>not logged in</div>;
  return <Calendar />;
};

export default CalendarPage;
