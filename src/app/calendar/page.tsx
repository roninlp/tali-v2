import { getServerAuthSession } from "@/server/auth";
import { unstable_noStore } from "next/cache";
import Calendar from "./_components/calendar";

const CalendarPage = async () => {
  unstable_noStore();
  const session = await getServerAuthSession();
  if (!session) return <div>not logged in</div>;
  return <Calendar />;
};

export default CalendarPage;
