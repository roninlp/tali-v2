import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { unstable_noStore } from "next/cache";
import Calendar from "./_components/calendar";

const CalendarPage = async () => {
  unstable_noStore();
  const session = await getServerAuthSession();
  if (!session) return <div>not logged in</div>;
  const projects = await api.project.getAll();
  console.log("🚀 ~ CalendarPage ~ projects:", projects);
  return <Calendar projects={projects} />;
};

export default CalendarPage;
