import { TooltipTrigger } from "@/components/Tooltip";
import React, {ReactElement} from 'react'
import { useDrag } from "react-dnd";
export default function DraggableDayTooltip({ children, style, task, ...props }) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: task.type,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", `${task.type}|${task.id}`);
  };
    return (
      <TooltipTrigger
        {...props}
        ref={drag}
        onDragStart={handleDragStart}
        className="absolute top-0 z-10 rounded-lg border px-2 py-1 text-[17px] text-white bg-red-400 hover:z-20"
         style={{...style, opacity: isDragging? 0.5 : 1, cursor: isDragging? "grabbing" : "grab"}}
        {...props}
            >
              {children}
      </TooltipTrigger>
    );
}