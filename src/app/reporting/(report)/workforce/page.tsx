import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import { cn } from "@/lib/cn";
import { getClientsData } from "../../data";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import FilterBySelection from "../../components/filter/FilterBySelection";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
  };
};

type TSliderData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit";
};
const filterMultipleSliders: TSliderData[] = [
  {
    id: 1,
    type: "price",
    min: 0,
    max: 300,
    defaultValue: [50, 250],
  },
  {
    id: 2,
    type: "cost",
    min: 0,
    max: 400,
    defaultValue: [100, 300],
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];
export default function WorkforceReportPage({ searchParams }: TProps) {
  const clients = getClientsData();
  return (
    <div className="space-y-5">
      {/* filter section */}
      {/* filter section */}
      <div className="flex w-full items-center justify-between gap-x-3">
        <div className="flex flex-1 items-center space-x-4">
          <FilterBySearchBox searchText={searchParams.search as string} />
          <FilterByDateRange
            startDate={decodeURIComponent(searchParams.startDate as string)}
            endDate={decodeURIComponent(searchParams.endDate as string)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <FilterByMultiple filterSliders={filterMultipleSliders} />
          <FilterBySelection
            selectedItem={searchParams?.category as string}
            items={["product", "parts", "wheel"]}
            type="category"
          />
          <FilterBySelection
            selectedItem={searchParams?.service as string}
            items={["washing", "changing wheel", "full service"]}
            type="service"
          />
        </div>
      </div>
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="Total Payout" amount={0} />
        <Calculation content="Overall Technician Performance" amount={500} />
        <Calculation content="Overall Sales Performance" amount={500} />
      </div>
      {/* Table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Employee</th>
              <th className="border-b px-4 py-2 text-center">Employee Type </th>
              <th className="border-b px-4 py-2 text-center">Total Payout</th>
              <th className="border-b px-4 py-2 text-center">Attendance</th>
              <th className="border-b px-4 py-2 text-center">
                # Jobs Completed
              </th>
              <th className="border-b px-4 py-2 text-center">Edit</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => (
              <tr
                key={index}
                className={cn(
                  "cursor-pointer rounded-md py-3",
                  index % 2 === 0 ? "bg-white" : "bg-blue-100",
                )}
              >
                <td className="border-b px-4 py-2 text-center">
                  {client.name}
                </td>
                <td className="border-b px-4 py-2 text-center">Technician</td>
                <td className="border-b px-4 py-2 text-center">500</td>
                <td className="border-b px-4 py-2 text-center">
                  {client.email}
                </td>
                <td className="border-b px-4 py-2 text-center">Bkash</td>
                <td className="border-b border-l bg-white px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="text-xl text-[#6571FF]">
                      <FaPenToSquare />
                    </button>
                    <button className="text-xl text-red-400">
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
