import { z } from "zod";

export const newProjectSchema = z.object({
  name: z
    .string({ required_error: "نام پروژه حتما باید مشخص باشد" })
    .min(3, { message: "حداقل ۳ کاراکتر" })
    .max(15, { message: "حداکثر ۱۵ کاراکتر" }),
  id: z.number().int().optional(),
  updatedAt: z.string().optional(),
});

export const newTaskSchema = z.object({
  name: z
    .string({ required_error: "نام پروژه حتما باید مشخص باشد" })
    .min(3, { message: "حداقل ۳ کاراکتر" })
    .max(15, { message: "حداکثر ۱۵ کاراکتر" }),
  projectId: z.number().int(),
  dueDate: z.string(),
});
