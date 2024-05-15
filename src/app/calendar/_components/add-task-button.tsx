"use client";

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
  FormDescription,
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
import { cn } from "@/lib/utils";
import { insertTaskSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { type z } from "zod";

export function AddProjectButton() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary">پروژه جدید</Button>
        </PopoverTrigger>
        <PopoverContent dir="rtl" className="sm:max-w-[425px]">
          <NewTaskForm setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary">پروژه جدید</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>پروژه جدید</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <NewTaskForm setOpen={setOpen} className="px-4" />
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
}

function NewTaskForm({ className, setOpen }: NewTaskFormProps) {
  const form = useForm<z.infer<typeof insertTaskSchema>>({
    resolver: zodResolver(insertTaskSchema),
  });
  const utils = api.useUtils();
  const { mutate } = api.task.create.useMutation({
    onSuccess: async () => {
      form.reset();
    },
    onSettled: async () => {
      await utils.task.getAllTasks.invalidate();
    },
  });

  async function onSubmit({
    name,
    projectId,
    dueDate,
    createdById,
  }: z.infer<typeof insertTaskSchema>) {
    setOpen(false);
    mutate({ name, projectId, dueDate, createdById });
  }

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
              <FormLabel>نام پروژه</FormLabel>
              <FormControl>
                <Input placeholder="نام پروژه ..." {...field} />
              </FormControl>
              <FormDescription>
                نام پروژه جدیدی که میخواهید اضافه کنید.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">ذخیره</Button>
      </form>
    </Form>
  );
}
