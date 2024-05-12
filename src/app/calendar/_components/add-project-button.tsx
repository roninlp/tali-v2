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
import { type newProjectSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Project } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
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
          <NewProjectForm setOpen={setOpen} />
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
        <NewProjectForm setOpen={setOpen} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface NewProjectFormProps extends React.ComponentProps<"form"> {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function NewProjectForm({ className, setOpen }: NewProjectFormProps) {
  const form = useForm<z.infer<typeof newProjectSchema>>({
    defaultValues: { name: "" },
  });
  const utils = api.useUtils();
  const { mutate } = api.project.create.useMutation({
    onMutate: async (newProject) => {
      await utils.project.getAll.cancel();
      const previousProjects = utils.project.getAll.getData();
      utils.project.getAll.setData(
        undefined,
        (oldQueryData: Project[] | undefined) =>
          [
            ...(oldQueryData ?? []),
            {
              name: newProject.name,
              id: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
              createdById: "1",
              userId: "1",
            },
          ] as Project[],
      );
      return { previousProjects };
    },
    onSuccess: async () => {
      form.reset();
    },
    onSettled: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  async function onSubmit({ name }: z.infer<typeof newProjectSchema>) {
    setOpen(false);
    mutate({ name });
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
