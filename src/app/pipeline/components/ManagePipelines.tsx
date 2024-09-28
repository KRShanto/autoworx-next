import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IoReorderTwoSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import {
  createColumn,
  deleteColumn,
  updateColumn,
  updateColumnOrder,
} from "@/actions/pipelines/pipelinesColumn";

interface Column {
  id: number | null;
  title: string;
  type: string;
  order: number;
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
  inputRef,
}: {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  handleColumnChange: (index: number, newName: string) => void;
  handleDeleteColumn: (index: number) => void;
  inputRef: (el: HTMLInputElement) => void;
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
      className={`mb-2 flex cursor-move items-center rounded-md bg-white p-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <IoReorderTwoSharp className="mr-2 text-gray-600" size={20} />
      <input
        type="text"
        ref={inputRef}
        value={column.title}
        onChange={(e) => handleColumnChange(index, e.target.value)}
        className="flex-grow rounded-md border border-gray-300 p-1"
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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (localColumns.length > columns.length) {
      const newIndex = localColumns.length - 1;
      inputRefs.current[newIndex]?.focus();
    }
  }, [localColumns, columns]);

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const updatedColumns = [...localColumns];
    const [draggedColumn] = updatedColumns.splice(dragIndex, 1);
    updatedColumns.splice(hoverIndex, 0, draggedColumn);
    setLocalColumns(updatedColumns);

    saveColumnsOrderToBackend(updatedColumns);
  };

  const handleColumnChange = (index: number, newName: string) => {
    const updatedColumns = [...localColumns];
    updatedColumns[index].title = newName;
    setLocalColumns(updatedColumns);
  };

  const handleDeleteColumn = async (index: number) => {
    const columnToDelete = localColumns[index];

    if (columnToDelete.id !== null) {
      await deleteColumn(columnToDelete.id);
    }

    const updatedColumns = localColumns.filter((_, i) => i !== index);
    setLocalColumns(updatedColumns);
  };

  const handleAddColumn = () => {
    const newOrder = localColumns.length; // Assign the new order as the length of the array
    const newColumn: Column = {
      id: null,
      title: "New Column",
      type: pipelineType,
      order: newOrder, // New column gets the next available order
    };
    setLocalColumns([...localColumns, newColumn]);
  };

  const handleSave = async () => {
    const columnsToSave = localColumns.map(async (column, index) => {
      column.order = index; // Ensure the correct order is saved
      if (column.id === null) {
        const newColumn = await createColumn(column.title, column.type);
        column.id = newColumn.id;
      } else {
        await updateColumn(column.id, column.title, pipelineType, column.order);
      }
    });

    // Wait for all columns to be saved/updated
    await Promise.all(columnsToSave);

    onSave(localColumns);
    onClose();
  };

  const saveColumnsOrderToBackend = async (updatedColumns: Column[]) => {
    const reorderedColumns = updatedColumns
      .filter((column) => column.id !== null)
      .map((column, index) => ({
        id: column.id!,
        order: index, // Save the index as the new order
      }));
    try {
      await updateColumnOrder(reorderedColumns); // API to save column order
    } catch (error) {
      console.error("Error saving column order:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-180 rounded-lg bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Edit Pipeline</h2>
          <div className="flex flex-col items-center justify-center">
            {localColumns.map((column, index) => (
              <ColumnItem
                key={column.id || `new-${index}`} // Fallback key for new columns
                index={index}
                column={column}
                moveColumn={moveColumn}
                handleColumnChange={handleColumnChange}
                handleDeleteColumn={handleDeleteColumn}
                inputRef={(el) => (inputRefs.current[index] = el)}
              />
            ))}
            <button
              onClick={handleAddColumn}
              className="mt-2 w-[75%] rounded border-2 border-blue-500 px-1 py-1 text-center text-sm text-blue-500"
            >
              + Add New Column
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 rounded-md bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
