"use client";

import { Combobox } from "@/components/combo-box";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { newTaskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { TaskType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  endOfMonth,
  format,
  startOfMonth,
  startOfToday,
} from "date-fns-jalali";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { type z } from "zod";

export function AddTaskButton({ day }: { day: Date }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className={cn(
              "group/btn absolute bottom-1 left-1 scale-0 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out group-hover:flex group-hover:scale-100",
              open ? "flex scale-100" : "",
            )}
          >
            <PlusIcon className="size-5 scale-100 transition-all group-hover/btn:scale-125" />
          </Button>
        </PopoverTrigger>
        <PopoverContent dir="rtl" className="sm:max-w-[425px]">
          <NewTaskForm day={day} setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className={cn(
            "group/btn absolute bottom-1 left-1 scale-0 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out group-hover:flex group-hover:scale-100",
          )}
        >
          <PlusIcon className="size-5 scale-100 transition-all group-hover/btn:scale-125" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>پروژه جدید</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <NewTaskForm setOpen={setOpen} day={day} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface NewTaskFormProps extends React.ComponentProps<"form"> {
  setOpen: Dispatch<SetStateAction<boolean>>;
  day: Date;
}

function NewTaskForm({ className, setOpen, day }: NewTaskFormProps) {
  const form = useForm<z.infer<typeof newTaskSchema>>({
    defaultValues: {
      name: "",
      dueDate: day,
      projectId: 1,
    },
    resolver: zodResolver(newTaskSchema),
  });
  const dayIndex = +format(day, "d");
  const utils = api.useUtils();
  const firstDayOfCurrentMonth = startOfToday();
  const { mutate } = api.task.create.useMutation({
    onMutate: async (newTask) => {
      await utils.task.getAllTasks.cancel();
      const previousTasks = utils.task.getAllTasks.getData();

      utils.task.getAllTasks.setData(
        {
          startDate: startOfMonth(firstDayOfCurrentMonth),
          endDate: endOfMonth(firstDayOfCurrentMonth),
        },
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
      projectId: Number(projectId),
      dueDate: day,
      createdById: "",
    });
  }

  const projectsOptions = projects?.map((project) => ({
    label: project.name,
    value: project.id,
  }));

  return (
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
              <FormLabel>نام تسک</FormLabel>
              <FormControl>
                <Input placeholder="نام پروژه ..." {...field} />
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
              <Combobox
                options={projectsOptions as { value: number; label: string }[]}
                value={field.value}
                setValue={(value) => form.setValue("projectId", value)}
                placeholder="انتخاب پروژه ..."
              >
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? projectsOptions?.find(
                          (project) => project.value === field.value,
                        )?.label
                      : "انتخاب پروژه"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </Combobox>
              {/* <FormDescription>
                انتخاب پروژه که تمام پروژه های در حال حاضر در قسمت انجام شده
                است.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">ذخیره</Button>
      </form>
    </Form>
  );
}
