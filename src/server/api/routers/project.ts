import { newProjectSchema } from "@/lib/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newProjectSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projects).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.projectId));
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.projects.findMany({
      where: eq(projects.createdById, ctx.session.user.id),
    });
  }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.projects.findFirst({
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
