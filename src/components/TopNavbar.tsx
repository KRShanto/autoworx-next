import { ImSearch } from "react-icons/im";
import TopNavbarIcons from "./TopNavbarIcons";

export default function TopNavbar() {
  return (
    <div className="flex h-[7vh] items-center justify-between p-5 pr-10">
      <form className="flex items-center">
        <div className="">
          {/* TEMP */}
          <ImSearch className="h-[14px] w-[14px] text-[#797979]" />
        </div>
        <input
          type="text"
          className="ml-2 border-none text-[15px] text-[#797979] outline-none"
          placeholder="Search here..."
        />
      </form>

      <TopNavbarIcons />
    </div>
  );
}
