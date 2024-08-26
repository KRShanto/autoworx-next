import { updateTask } from "@/actions/task/dragTask";
import { cn } from "@/lib/cn";
import moment from "moment";
import { useEffect, useState } from "react";
import { ResizableBox } from "react-resizable";

type TProps = {
  children: React.ReactNode;
  height?: number;
  width?: number;
  task: any;
  style?: React.CSSProperties;
  className?: string;
  rowsLength: number;
};
export default function ResizeTaskTooltip({
  children,
  height,
  width,
  task,
  rowsLength,
  ...props
}: TProps) {
  const [size, setSize] = useState({
    width: width || 300,
    height: height || 75,
  });
  const [hovered, setHovered] = useState(false);
  console.log({ height }, "resize height");

  const [newEndTime, setNewEndTime] = useState("");

  const [isOverHeight, setIsOverHeight] = useState(false);

  const handleResizeStart = () => {
    setNewEndTime(task.endTime);
    setHovered(true);
  };
  useEffect(() => {
    if (height) {
      setSize((prev) => ({ ...prev, height }));
    }
  }, [height]);
  const handleResize = (event: any, { size }: any) => {
    const heightConvertedMinutes = Math.round((size.height / 75) * 60);
    const newEndTime = moment(`2024-07-06T${task.startTime}:00`)
      .add(heightConvertedMinutes, "minutes")
      .format("HH:mm");
    const remainingHeight = (rowsLength - task.rowStartIndex) * 75;
    if (size.height > remainingHeight) {
      setIsOverHeight(true);
    } else {
      setSize(size);
      setIsOverHeight(false);
    }
    setNewEndTime(newEndTime);
  };
  const handleResizeStop = async (event: any, { size }: any) => {
    setHovered(false);
    const heightConvertedMinutes = Math.round((size.height / 75) * 60);
    const newEndTime = moment(`2024-07-06T${task.startTime}:00`)
      .add(heightConvertedMinutes, "minutes")
      .format("HH:mm");
    // const lastRowsTime = moment("23:00", "HH:mm");
    // const comparisonTime = moment(newEndTime, "HH:mm");
    // console.log({ isOverHeight });
    // const updatedDate = {};
    if (isOverHeight) {
      const eventStartTime = moment(task.startTime, "HH:mm");
      const eventEndTime = moment(task.endTime, "HH:mm");
      const diffByMinutes = eventEndTime.diff(eventStartTime, "minutes");
      const height = Math.round((diffByMinutes / 60) * 75);
      setSize({ ...size, height: height });
    } else {
      await updateTask({
        id: task.id,
        date: new Date(task.date),
        startTime: task.startTime,
        endTime: newEndTime,
      });
    }
    // if (isAfterElevenFiftyNinePM(newEndTime.toString())) {
    // }
    // if (lastRowsTime.isBefore(comparisonTime)) {
    // } else {

    // }
  };
  return (
    <ResizableBox
      {...props}
      className={cn(hovered && "z-50")}
      height={size.height}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      width={size.width} // Fixed width, or you can allow resizing horizontally as well
      axis="y" // Only allow vertical resizing
      minConstraints={[300, 32]} // Minimum width and height
      resizeHandles={["s"]} // Resize handle at the bottom ('s' for south)
      onResize={handleResize}
      // style={{ backgroundColor: "red" }}
      handle={
        <div className="absolute bottom-0 h-1.5 w-full cursor-s-resize rounded-lg text-center hover:z-50">
          {hovered && (
            <div className="absolute bottom-0 left-1/2 flex min-w-40 max-w-44 -translate-x-[50%] items-center justify-center space-x-2 rounded-tl-md rounded-tr-md bg-stone-200 p-0.5 text-sm">
              <span>{moment(task.startTime, "HH:mm").format("h:mm A")}</span>
              <span>-</span>
              <span>{moment(newEndTime, "HH:mm").format("h:mm A")}</span>
            </div>
          )}
        </div>
      }
    >
      {children}
    </ResizableBox>
  );
}
