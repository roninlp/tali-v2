"use server";

import { newProjectSchema } from "@/lib/schemas";
import { createAction, protectedProcedure } from "../api/trpc";
import { projects } from "../db/schema";

export const createProjectAction = createAction(
  protectedProcedure
    .input(newProjectSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("new project mutation server action called", input);
      await ctx.db.insert(projects).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),
);
