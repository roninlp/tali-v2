"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStartAndEndOfMonth } from "@/helpers/date-helpers";
import { newTaskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDate } from "date-fns-jalali";
import { Dispatch, SetStateAction } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";

interface NewTaskFormProps extends React.ComponentProps<"form"> {
  setOpen: Dispatch<SetStateAction<boolean>>;
  day: Date;
}

export function NewTaskForm({ className, setOpen, day }: NewTaskFormProps) {
  const form = useForm<z.infer<typeof newTaskSchema>>({
    defaultValues: {
      name: "",
      dueDate: day,
      projectId: 1,
    },
    resolver: zodResolver(newTaskSchema),
  });
  const dayIndex = getDate(day);
  const utils = api.useUtils();
  const monthObj = getStartAndEndOfMonth(day);

  const { mutate } = api.task.create.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel();
      const previousTasks = utils.task.getAllTasks.getData(monthObj);

      utils.task.getAllTasks.setData(
        monthObj,
        (oldQueryData: TaskType[][] | undefined) => {
          return oldQueryData?.map((days, index) =>
            index === dayIndex - 1
              ? [
                  ...days,
                  {
                    name: newTask.name,
                    projectId: newTask.projectId,
                    id: 1,
                    createdById: "",
                    description: "",
                    createdAt: "",
                    updatedAt: "",
                    dueDate: day,
                    isCompleted: false,
                  },
                ]
              : days,
          );
        },
      );
      return { previousTasks };
    },
    onSuccess: async () => {
      form.reset();
    },
    onSettled: async () => {
      await utils.task.getAllTasks.invalidate();
    },
  });

  const projects = utils.project.getAll.getData();

  async function onSubmit({ name, projectId }: z.infer<typeof newTaskSchema>) {
    setOpen(false);
    mutate({
      name,
      projectId: +projectId,
      dueDate: day,
      createdById: "",
    });
  }

  const projectsOptions = projects?.map((project) => ({
    label: project.name,
    value: project.id,
  }));

  return !!projectsOptions && projectsOptions?.length > 0 ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>عنوان تسک</FormLabel>
              <FormControl>
                <Input placeholder="عنوان تسک ..." {...field} />
              </FormControl>
              {/* <FormDescription>
                نام تسک جدیدی که میخواهید اضافه کنید.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>پروژه</FormLabel>
              <Select
                dir="rtl"
                onValueChange={(val) => form.setValue("projectId", +val)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب پروژه" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectsOptions.map((project) => (
                    <SelectItem
                      key={project.value}
                      value={project.value.toString()}
                    >
                      {project.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">ذخیره</Button>
      </form>
    </Form>
  ) : (
    <div>لطفا حداقل یک پروژه اضافه کنید.</div>
  );
}
