import { TaskType } from "@/server/db/schema";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IDraggingTaskState {
  task?: TaskType;
  isDragging: boolean;
}

interface IDraggingTaskActions {
  actions: {
    handleDragStart: (task: TaskType) => void;
    handleDragEnd: () => void;
  };
}

const initialState: IDraggingTaskState = {
  isDragging: false,
  task: undefined,
};

const useDraggingTaskStore = create<
  IDraggingTaskState & IDraggingTaskActions
>()(
  devtools((set, get) => ({
    task: initialState.task,
    isDragging: initialState.isDragging,
    actions: {
      handleDragEnd: () => {
        set({ isDragging: false, task: undefined });
      },
      handleDragStart: (task) => {
        set({ isDragging: true, task });
      },
    },
  })),
);

export const useDraggingTask = () =>
  useDraggingTaskStore((state) => state.task);
export const useIsDraggingTask = () =>
  useDraggingTaskStore((state) => state.isDragging);
export const useDraggingActions = () =>
  useDraggingTaskStore((state) => state.actions);
