import {
  addMonths,
  format,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns-jalali";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ICurrentMonthState {
  month: string;
  monthDate: Date;
}

interface ICurrentMonthAction {
  actions: {
    incrementMonth: () => void;
    decrementMonth: () => void;
  };
}

const today = startOfToday();

const initialState: ICurrentMonthState = {
  month: format(today, "MMM-yyyy"),
  monthDate: startOfMonth(today),
};

const useCurrentMonthStore = create<ICurrentMonthState & ICurrentMonthAction>()(
  devtools((set, get) => ({
    month: initialState.month,
    monthDate: initialState.monthDate,
    actions: {
      incrementMonth: () => {
        const addMonthsDate = addMonths(get().monthDate, 1);
        const newMonthDate = format(addMonthsDate, "MMM-yyyy");
        set({ month: newMonthDate, monthDate: addMonthsDate });
      },
      decrementMonth: () => {
        const subMonthsDate = subMonths(get().monthDate, 1);
        const newMonthDate = format(subMonthsDate, "MMM-yyyy");
        set({ month: newMonthDate, monthDate: subMonthsDate });
      },
    },
  })),
);

export const useMonthState = () => useCurrentMonthStore((state) => state.month);
export const useMonthDateState = () =>
  useCurrentMonthStore((state) => state.monthDate);
export const useMonthActions = () =>
  useCurrentMonthStore((state) => state.actions);
