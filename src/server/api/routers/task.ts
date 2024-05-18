import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTaskSchema, tasks } from "@/server/db/schema";
import {
  addDays,
  differenceInDays,
  endOfDay,
  startOfDay,
} from "date-fns-jalali";
import { and, eq } from "drizzle-orm";

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
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const targerStart = startOfDay(input.startDate);

      const targetEnd = endOfDay(input.endDate);
      const daysBetweenStartAndEnd = differenceInDays(
        endOfDay(input.endDate),
        startOfDay(input.startDate),
      );

      //create an array of dates between startDate and endDate that have the date as values
      const datesBetweenStartAndEnd = Array.from(
        { length: daysBetweenStartAndEnd + 1 },
        (_, i) => addDays(input.startDate, i),
      );

      const allTasks = await ctx.db.query.tasks.findMany({
        where: and(
          // between(
          //   parse(tasks.dueDate, "yyyy-MM-dd HH:mm:ss", new Date()),
          //   targerStart,
          //   targetEnd,
          // ),
          eq(tasks.createdById, ctx.session.user.id),
        ),
      });

      const returnTasks = datesBetweenStartAndEnd.map((date) => {
        const task = allTasks.filter(
          (task) => startOfDay(task.dueDate) === startOfDay(date),
        );
        return task;
      });

      return returnTasks;
    }),

  // getAllTasksOfMonth: protectedProcedure
  //   .input(
  //     z.object({
  //       month: z.number(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const targerMonthStart = getUnixTime(startOfMonth(input.month));
  //     const targetMonthEnd = getUnixTime(endOfMonth(input.month));

  //     const tasksForMonth = await ctx.db.query.tasks.findMany({
  //       where: and(
  //         between(tasks.dueDate, targerMonthStart, targetMonthEnd),
  //         eq(tasks.createdById, ctx.session.user.id),
  //       ),
  //     });
  //     // const tasksForMonth = await ctx.db
  //     //   .select()
  //     //   .from(tasks)
  //     //   .innerJoin(projects, eq(tasks.projectId, projects.id))
  //     //   .where(
  //     //     and(
  //     //       eq(projects.userId, ctx.session.user.id),
  //     //       between(tasks.dueDate, targerMonthStart, targetMonthEnd),
  //     //     ),
  //     //   );
  //     return tasksForMonth;
  //   }),
});
