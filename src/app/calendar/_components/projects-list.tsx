import { api } from "@/trpc/server";

export default async function ProjectsList() {
  const projects = await api.project.getAll();
  return <div>ProjectsList</div>;
}
