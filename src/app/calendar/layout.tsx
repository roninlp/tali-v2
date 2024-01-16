import { type ReactNode } from "react";

const CalendarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div dir="rtl" className="font-vazir h-screen">
      {children}
    </div>
  );
};

export default CalendarLayout;
