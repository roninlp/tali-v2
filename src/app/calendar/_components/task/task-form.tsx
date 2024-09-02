"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useForm } from "react-hook-form";
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
      projectId: undefined,
    },
    resolver: zodResolver(newTaskSchema),
  });
  const dayIndex = getDate(day);
  const utils = api.useUtils();
  const monthObj = getStartAndEndOfMonth(day);

  const { mutate } = api.task.create.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel(monthObj);
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
        className={cn(
          "grid h-fit items-start gap-4 overflow-hidden p-1 transition-all",
          className,
        )}
      >
        <div
          className={cn(
            "transition-all",
            !form.watch("projectId")
              ? "translate-x-0"
              : "h-0 -translate-x-[calc(100%_+_5px)]",
          )}
        >
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem className={cn("space-y-3 transition-all duration-500")}>
                <FormLabel>انتخاب پروژه</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => {
                      form.setValue("projectId", +val);
                      form.setValue(
                        "name",
                        projectsOptions.find((prj) => prj.value == +val)
                          ?.label!,
                      );
                    }}
                    defaultValue={String(field.value)}
                    className="flex flex-col space-y-1"
                  >
                    {projectsOptions.map((project) => (
                      <FormItem
                        key={project.value}
                        className="flex items-center gap-3 space-y-0 rounded border border-primary p-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={String(project.value)} />
                        </FormControl>
                        <FormLabel className="flex-1 font-normal">
                          {project.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            "transition-all",
            !!form.watch("projectId")
              ? "translate-x-0"
              : "h-0 translate-x-[calc(100%_+_5px)]",
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem
                className={cn("grid gap-2 transition-transform duration-500")}
              >
                <FormLabel>عنوان تسک</FormLabel>
                <FormControl>
                  <Input placeholder="عنوان تسک ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!!form.watch("projectId") ? (
          <Button type="submit">ذخیره</Button>
        ) : null}
      </form>
    </Form>
  ) : (
    <div>لطفا حداقل یک پروژه اضافه کنید.</div>
  );
}
