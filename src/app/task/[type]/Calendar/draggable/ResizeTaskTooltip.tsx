import { updateTask } from "@/actions/task/dragTask";
import { cn } from "@/lib/cn";
import moment from "moment";
import { useState } from "react";
import { ResizableBox } from "react-resizable";

type TProps = {
  children: React.ReactNode;
  height?: number;
  width?: number;
  task: any;
  style?: React.CSSProperties;
  className?: string;
};
export default function ResizeTaskTooltip({
  children,
  height,
  width,
  task,
  ...props
}: TProps) {
  const [boxHeight, setBoxHeight] = useState(0);
  const [hovered, setHovered] = useState(false);
  const handleResizeStart = () => {
    setHovered(true);
  };
  const handleResize = (event: any, { size }: any) => {
    setBoxHeight(size.height);
  };
  const handleResizeStop = async (event: any, { size }: any) => {
    setHovered(false);
    const heightConvertedMinutes = Math.round((size.height / 75) * 60);
    console.log({ heightConvertedMinutes, height: size.height });
    const newEndTime = moment(`2024-07-06T${task.startTime}:00`)
      .add(heightConvertedMinutes, "minutes")
      .format("HH:mm");
    await updateTask({
      id: task.id,
      date: new Date(task.date),
      startTime: task.startTime,
      endTime: newEndTime,
    });
  };
  return (
    <ResizableBox
      {...props}
      className={cn(hovered && "z-50")}
      height={height! > 0 ? height! : boxHeight}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      width={width || 300} // Fixed width, or you can allow resizing horizontally as well
      axis="y" // Only allow vertical resizing
      minConstraints={[300, 75]} // Minimum width and height
      resizeHandles={["s"]} // Resize handle at the bottom ('s' for south)
      onResize={handleResize}
      // style={{ backgroundColor: "red" }}
      handle={
        <div className="absolute bottom-0 h-1.5 w-full cursor-s-resize rounded-lg text-center hover:z-50" />
      }
    >
      {children}
    </ResizableBox>
  );
}
