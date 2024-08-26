import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import { formatDate, formatTime } from "@/utils/taskAndActivity";
import { CalendarSettings, User } from "@prisma/client";
import { useState } from "react";

type TProps = {
  row: any;
  rows: any;
  index: number;
  settings: CalendarSettings;
  companyUsers: User[];
  onDrop: (event: React.DragEvent, rowIndex: number) => void;
};

export default function DayRow({
  row,
  index,
  rows,
  settings,
  companyUsers,
  onDrop,
}: TProps) {
  const [draggedOverRow, setDraggedOverRow] = useState<number | null>(null);

  const { open } = usePopupStore();

  const rowTime = formatTime(row);

  const dateRangeforBgChanger =
    rowTime >= settings?.dayStart && rowTime <= settings?.dayEnd;

  return (
    <div key={index} className="relative">
      <div
        className={cn(
          "absolute -top-[37.5px] flex h-full w-[100px] items-center justify-center text-[19px]",
          index === 0 && "-top-5 text-base",
        )}
        style={{
          color:
            rowTime >= settings?.dayStart && rowTime <= settings?.dayEnd
              ? "#7575a3"
              : "#d1d1e0",
        }}
      >
        {row}
      </div>
      <button
        type="button"
        onDrop={(event: React.DragEvent) => {
          onDrop(event, index);
          setDraggedOverRow(null);
        }}
        onDragOver={(event: React.DragEvent) => {
          event.preventDefault();
          setDraggedOverRow(index);
        }}
        onDragLeave={() => setDraggedOverRow(null)}
        className={cn(
          "ml-[85px] block h-[75px] border-neutral-200",
          index !== rows.length && "border-b border-l",
          index !== 0 ? "cursor-pointer" : "border-t",
        )}
        onClick={() => {
          const date = formatDate(new Date());
          const startTime = formatTime(row);
          open("ADD_TASK", { date, startTime, companyUsers });
        }}
        disabled={index === 0}
        style={{
          backgroundColor:
            draggedOverRow === index
              ? "#c4c4c4"
              : dateRangeforBgChanger
                ? " white	"
                : "#f2f2f2",
          width: "calc(100% - 85px)",
        }}
      >
        {/* Row heading */}
      </button>
    </div>
  );
}
