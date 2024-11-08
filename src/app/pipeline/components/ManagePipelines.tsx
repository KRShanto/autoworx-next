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
import { toast } from "react-hot-toast";
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
const restrictedColumns = ["Pending", "In Progress", "Completed"];
function ColumnItem({
  column,
  index,
  moveColumn,
  handleColumnChange,

  handleDeleteColumn,
  inputRef,
}: Readonly<{
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  handleColumnChange: (index: number, newName: string) => void;

  handleDeleteColumn: (index: number) => void;
  inputRef: (el: HTMLInputElement) => void;
}>) {
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
      className={`mb-2 flex cursor-move items-center rounded-md border-red-800 bg-white p-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <IoReorderTwoSharp className="mr-2 text-gray-600" size={20} />
      <input
        type="text"
        ref={inputRef}
        value={column.title}
        onChange={(e) => handleColumnChange(index, e.target.value)}
        className="flex-grow rounded-md border border-red-300 p-1"
        readOnly={
          restrictedColumns.includes(column.title) && column.id !== null
        }
      />
      {!restrictedColumns.includes(column.title) && column.id !== null ? (
        <button
          onClick={() => handleDeleteColumn(index)}
          className="ml-2 text-[#FF6262] hover:text-red-700"
        >
          <RxCross2 size={20} />
        </button>
      ) : (
        <div className="m-0 w-7 p-0"></div>
      )}
    </div>
  );
}
export default function ManagePipelines({
  columns,
  onSave,
  onClose,
  pipelineType,
}: Readonly<ManagePipelinesModalProps>) {
  const [localColumns, setLocalColumns] = useState<Column[]>(columns);
  const [deletedColumns, setDeletedColumns] = useState<Column[]>([]);
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

    //prevent from deletion
    if (restrictedColumns.includes(columnToDelete.title)) {
      toast.error("Deletion of restricted column is not allowed.");
      return;
    }

    //reflect on UI
    const updatedColumns = localColumns.filter((_, i) => i !== index);
    setLocalColumns(updatedColumns);

    if (columnToDelete.id != null) {
      setDeletedColumns([...deletedColumns, columnToDelete]);
    }
  };

  const handleAddColumn = () => {
    const newOrder = localColumns.length;
    const newColumn: Column = {
      id: null,
      title: "New Column",
      type: pipelineType,
      order: newOrder,
    };
    setLocalColumns([...localColumns, newColumn]);
  };

  const handleSave = async () => {
    const invalidColumns = localColumns.filter((column) =>
      restrictedColumns.includes(column.title),
    );

    if (invalidColumns.length > 0) {
      toast.error(
        `Cannot use restricted column names: ${invalidColumns
          .map((c) => `'${c.title}'`)
          .join(", ")}`,
      );
      return;
    }

    const columnsToSave = localColumns.map(async (column, index) => {
      column.order = index; // Ensure the correct order is saved

      if (restrictedColumns.includes(column.title)) {
        return;
      }

      if (column.id === null) {
        const newColumn = await createColumn(column.title, column.type);
        column.id = newColumn.id;
      } else {
        await updateColumn(column.id, column.title, pipelineType, column.order);
      }
    });

    const columnsToDelete = deletedColumns.map(async (column) => {
      if (column.id !== null) {
        await deleteColumn(column.id);
      }
    });

    // Wait for all columns to be saved/updated and deleted
    await Promise.all([...columnsToSave, ...columnsToDelete]);

    onSave(localColumns);
    onClose();
  };

  const saveColumnsOrderToBackend = async (updatedColumns: Column[]) => {
    const reorderedColumns = updatedColumns
      .filter((column) => column.id !== null)
      .map((column, index) => ({
        id: column.id!,
        order: index,
      }));
    try {
      await updateColumnOrder(reorderedColumns);
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
                key={column.id ?? `new-${index}`} // Fallback key for new columns
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
