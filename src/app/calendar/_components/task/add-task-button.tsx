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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NewTaskForm } from "./task-form";

type AddTaskButtonProps = {
  day: Date;
};

export function AddTaskButton({ day }: AddTaskButtonProps) {
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
              "group/btn absolute bottom-1 left-1 z-30 scale-0 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out group-hover:flex group-hover:scale-100",
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
      <DrawerTrigger dir="rtl" asChild>
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
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-left">
          <DrawerTitle>تسک جدید</DrawerTitle>
          <DrawerDescription>
            یک تسک جدید برای یکی از پروژه‌ها اضافه کنید.
          </DrawerDescription>
        </DrawerHeader>
        <NewTaskForm setOpen={setOpen} day={day} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">بستن</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
