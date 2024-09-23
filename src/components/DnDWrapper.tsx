"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const DnDWrapper = React.memo(function DndWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [context, setContext] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContext(document.getElementById(id));
  }, []);
  return (
    <DndProvider
      backend={HTML5Backend}
      options={{ rootElement: context }}
      key={1}
    >
      {children}
    </DndProvider>
  );
});

export default DnDWrapper;
