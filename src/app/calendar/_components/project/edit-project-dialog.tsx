"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { ProjectType } from "@/server/db/schema";

import { Dispatch, SetStateAction, useState } from "react";
import { NewProjectForm } from "./project-form";

type EditProjectDialogProps = {
  project: ProjectType;
  setDropDownOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditProjectDialog({
  project,
  setDropDownOpen,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div>ویرایش</div>
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={() => setDropDownOpen(false)} dir="rtl">
        <DialogHeader>
          <DialogTitle>ویرایش پروژه</DialogTitle>
          <DialogDescription>skdfhksd</DialogDescription>
        </DialogHeader>
        <NewProjectForm project={project} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
