"use client";

import ColorSelect from "@/components/color-select";
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
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { newProjectSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { type ProjectType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-jalali";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { type z } from "zod";

export function AddProjectButton({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId?: number;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent dir="rtl" className="sm:max-w-[425px]">
          <NewProjectForm setOpen={setOpen} />
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
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
  project?: ProjectType;
  setDropDownOpen?: Dispatch<SetStateAction<boolean>>;
}

export function NewProjectForm({
  className,
  setOpen,
  project,
}: NewProjectFormProps) {
  const form = useForm<z.infer<typeof newProjectSchema>>({
    defaultValues: {
      name: project?.name ?? "",
      color: project?.color ?? "#f44336",
    },
    resolver: zodResolver(newProjectSchema),
  });
  const utils = api.useUtils();
  const { mutate } = api.project.create.useMutation({
    onMutate: async (newProject) => {
      await utils.project.getAll.cancel();
      const previousProjects = utils.project.getAll.getData();
      const addedProject: ProjectType = !!project
        ? { ...project, name: newProject.name, color: newProject.color }
        : {
            name: newProject.name,
            id: Math.random(),
            createdAt: "",
            updatedAt: "",
            createdById: "1",
            userId: "1",
            color: newProject.color ?? "#f44336",
          };
      utils.project.getAll.setData(
        undefined,
        (oldQueryData: ProjectType[] | undefined) => {
          if (!!project) {
            return (
              oldQueryData?.map((oldProject) =>
                oldProject.id === addedProject.id ? addedProject : oldProject,
              ) ?? []
            );
          } else {
            return !!oldQueryData
              ? ([addedProject, ...oldQueryData] as ProjectType[])
              : [];
          }
        },
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

  async function onSubmit({ name, color }: z.infer<typeof newProjectSchema>) {
    handleClose();
    mutate({
      name,
      id: project?.id,
      color,
      updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
  }

  const handleClose = () => {
    setOpen(false);
  };

  form.getValues("color");

  console.log(form.getValues("color"), "color");

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
                <Input
                  className="flex-grow"
                  placeholder="نام پروژه ..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                نام پروژه جدیدی که میخواهید اضافه کنید.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>رنگ</FormLabel>
              <FormControl>
                <ColorSelect
                  value={field.value}
                  setValue={(value) => form.setValue("color", value)}
                  colors={[
                    "#f44336",
                    "#e91e63",
                    "#9c27b0",
                    "#673ab7",
                    "#3f51b5",
                    "#2196f3",
                  ]}
                />
              </FormControl>
              <FormDescription>
                رنگ پروژه جدیدی که میخواهید اضافه کنید.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2">
          <Button type="submit">ذخیره</Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            لغو
          </Button>
        </div>
      </form>
    </Form>
  );
}
