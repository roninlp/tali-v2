import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTaskSchema, tasks } from "@/server/db/schema";
import {
  endOfDay,
  endOfMonth,
  getUnixTime,
  startOfDay,
  startOfMonth,
} from "date-fns-jalali";
import { and, between, eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        name: input.name,
        dueDate: input.dueDate,
        projectId: input.projectId,
        createdById: ctx.session.user.id,
      });
    }),
  //create an api route to get all tasks between two dates
  getAllTasks: protectedProcedure
    .input(
      z.object({
        startDate: z.number(),
        endDate: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const targerStart = getUnixTime(startOfDay(input.startDate));
      const targetEnd = getUnixTime(endOfDay(input.endDate));

      const tasksForMonth = await ctx.db.query.tasks.findMany({
        where: and(
          between(tasks.dueDate, targerStart, targetEnd),
          eq(tasks.createdById, ctx.session.user.id),
        ),
      });
      return tasksForMonth;
    }),

  getAllTasksOfMonth: protectedProcedure
    .input(
      z.object({
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const targerMonthStart = getUnixTime(startOfMonth(input.month));
      const targetMonthEnd = getUnixTime(endOfMonth(input.month));

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
