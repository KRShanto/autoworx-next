import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IoReorderTwoSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

interface Column {
  id: number;
  title: string;
  type: string;
}

interface ManagePipelinesModalProps {
  columns: Column[];
  onSave: (updatedColumns: Column[]) => void;
  onClose: () => void;
  pipelineType: string;
}

const ItemType = "COLUMN";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function ColumnItem({
  column,
  index,
  moveColumn,
  handleColumnChange,
  handleDeleteColumn,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  handleColumnChange: (index: number, newName: string) => void;
  handleDeleteColumn: (index: number) => void;
}) {
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem) {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const ref = React.useRef(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center mb-2 bg-white p-2 rounded-md cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <IoReorderTwoSharp className="mr-2 text-gray-600" size={20} />
      <input
        type="text"
        value={column.title}
        onChange={(e) => handleColumnChange(index, e.target.value)}
        className="border border-gray-300 rounded-md p-1 flex-grow"
      />
      <button
        onClick={() => handleDeleteColumn(index)}
        className="ml-2 text-[#FF6262] hover:text-red-700"
      >
        <RxCross2 size={20} />
      </button>
    </div>
  );
}
export default function ManagePipelines({
  columns,
  onSave,
  onClose,
  pipelineType,
}: ManagePipelinesModalProps) {
  const [localColumns, setLocalColumns] = useState<Column[]>(columns);

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const updatedColumns = [...localColumns];
    const [draggedColumn] = updatedColumns.splice(dragIndex, 1);
    updatedColumns.splice(hoverIndex, 0, draggedColumn);
    setLocalColumns(updatedColumns);
  };

  const handleColumnChange = (index: number, newName: string) => {
    const updatedColumns = [...localColumns];
    updatedColumns[index].title = newName;
    setLocalColumns(updatedColumns);
  };

  const handleDeleteColumn = (index: number) => {
    let updatedColumns = localColumns.filter((_, i) => i !== index);
  
    // Update IDs after deleting a column to maintain sequential order
    updatedColumns = updatedColumns.map((column, i) => ({
      ...column,
      id: (i + 1),
    }));
  
    setLocalColumns(updatedColumns);
  };
  
  const handleAddColumn = () => {
    const newId = (localColumns.length + 1); // Assign new ID sequentially
    const newColumn = { id: newId, title: "New Column" ,type:pipelineType};
  
    setLocalColumns([...localColumns, newColumn]);
  };
  const handleSave = () => {
    onSave(localColumns);
    onClose();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-lg p-6 w-180">
          <h2 className="text-lg font-semibold mb-4">Edit Pipeline</h2>
          <div className="flex flex-col justify-center items-center">
            {localColumns.map((column, index) => (
              <ColumnItem
                key={column.id}
                index={index}
                column={column}
                moveColumn={moveColumn}
                handleColumnChange={handleColumnChange}
                handleDeleteColumn={handleDeleteColumn}
              />
            ))}
            <button
              onClick={handleAddColumn}
              className="text-blue-500 text-sm mt-2 border-2 border-blue-500 rounded px-1 py-1 text-center w-[75%]"
            >
              + Add New Column
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
