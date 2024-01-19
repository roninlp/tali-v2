import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { insertTaskSchema, tasks } from "@/server/db/schema";
import { addMonths, getUnixTime, startOfMonth } from "date-fns-jalali";
import { and, between, eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        name: input.name,
        dueDate: input.dueDate,
        createdById: ctx.session.user.id,
      });
    }),

  getAllTasksOfMonth: protectedProcedure
    .input(
      z.object({
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const targerMonthStart = getUnixTime(startOfMonth(input.month));
      const targetMonthEnd = getUnixTime(
        addMonths(startOfMonth(input.month), 1),
      );
      const tasksForMonth = await ctx.db.query.tasks.findMany({
        where: and(
          between(tasks.dueDate, targerMonthStart, targetMonthEnd),
          eq(tasks.createdById, ctx.session.user.id),
        ),
      });
      // const tasksForMonth = await ctx.db
      //   .select()
      //   .from(tasks)
      //   .innerJoin(projects, eq(tasks.projectId, projects.id))
      //   .where(
      //     and(
      //       eq(projects.userId, ctx.session.user.id),
      //       between(tasks.dueDate, targerMonthStart, targetMonthEnd),
      //     ),
      //   );
      return tasksForMonth;
    }),
});
