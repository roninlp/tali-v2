import { endOfMonth, startOfMonth } from "date-fns-jalali"

export const getStartAndEndOfMonth = (date: Date) => {
  return {
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  }
}
