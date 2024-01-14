import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.tasks.findMany({
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });
  }),

  // getThisMonth: protectedProcedure
  //   .input(z.object({ month: z.string() }))
  //   .query(({ input, ctx }) => {
  //     return ctx.db.query.tasks.findMany({
  //       where: (tasks, { eq }) => [eq(tasks.dueDate, input.month)],
  //     });
  //   }),
});
