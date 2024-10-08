import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTaskSchema, tasks } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import {
  addDays,
  differenceInDays,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns-jalali";
import { and, between, eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(tasks)
        .values({
          name: input.name,
          dueDate: input.dueDate,
          projectId: input.projectId,
          createdById: ctx.session.user.id,
        })
        .returning();
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
        endOfDay(addDays(input.endDate, 1)),
        startOfDay(input.startDate),
      );
      console.log("daysBetweenStartAndEnd", daysBetweenStartAndEnd);

      //create an array of dates between startDate and endDate that have the date as values
      const datesBetweenStartAndEnd = Array.from(
        { length: daysBetweenStartAndEnd },
        (_, i) => addDays(input.startDate, i),
      );
      const allTasks = await ctx.db.query.tasks.findMany({
        where: and(
          between(tasks.dueDate, targerStart, targetEnd),
          eq(tasks.createdById, ctx.session.user.id),
        ),
      });
      const returnTasks = datesBetweenStartAndEnd.map((date) => {
        const dayTasks = allTasks.filter((task) =>
          isSameDay(task.dueDate, date),
        );
        return dayTasks;
      });
      return returnTasks;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().optional(),
        dueDate: z.date().optional(),
        isCompleted: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: eq(tasks.id, input.id),
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(tasks)
        .set({
          name: input.name,
          dueDate: input.dueDate,
          isCompleted: input.isCompleted,
        })
        .where(eq(tasks.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
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
