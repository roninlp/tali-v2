"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { type newProjectSchema } from "@/lib/schemas";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { revalidatePath } from "next/cache";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

export function AddProjectButton() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">پروژه جدید</Button>
        </DialogTrigger>
        <DialogContent dir="rtl" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>پروژه جدید</DialogTitle>
            <DialogDescription>
              نام پروژه جدید را وارد کنید و روی ذخیره کلیک کنید.
            </DialogDescription>
          </DialogHeader>
          <NewProjectForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">پروژه جدید</Button>
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
  const form = useForm<z.infer<typeof newProjectSchema>>({});
  const create = api.project.create.useMutation({
    onSuccess: () => {
      form.reset();
      revalidatePath("/calendar");
      setOpen(false);
    },
  });

  async function onSubmit({ name }: z.infer<typeof newProjectSchema>) {
    create.mutate({ name });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
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
