import { CiSearch } from "react-icons/ci";
export default function FilterBySearchBox() {
  return (
    <div className="relative min-w-[693px]">
      <CiSearch className="absolute left-[10px] top-[9px]" />
      <input
        className="w-full rounded-md border py-1 pl-8 focus:outline-none"
        type="text"
        placeholder="search"
      />
    </div>
  );
}
