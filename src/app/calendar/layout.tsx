import { type ReactNode } from "react";

const CalendarLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-screen flex-col">{children}</div>;
};

export default CalendarLayout;
