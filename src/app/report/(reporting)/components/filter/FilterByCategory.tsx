import { IoMdArrowDropdown } from "react-icons/io";
export default function FilterByCategory() {
    return (
        <button
        className="flex max-w-80 items-center gap-2 rounded-lg border border-gray-400 p-1 text-sm text-gray-400 hover:border-blue-600 px-5"
      >
        <span>
          Category
        </span>
        <IoMdArrowDropdown />
      </button>
    )
}