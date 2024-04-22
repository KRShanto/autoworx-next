import React, { LegacyRef } from "react";
import { useDrag } from "react-dnd";

export default function TagComponent({ tag }: { tag: string }) {
  const [{ isDragging }, drag] = useDrag({
    type: "tag",
    item: { type: "tag", name: tag },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", `tag|${tag}`);
  };

  return (
    <div
      className="cursor-move rounded-full bg-blue-400 px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      ref={drag as unknown as LegacyRef<HTMLDivElement>}
      draggable
      onDragStart={handleDragStart}
    >
      {tag}
    </div>
  );
}
