import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getClientsData } from "../../data";
import FilterBySelection from "../../components/filter/FilterBySelection";
import Analytics from "./Analytics";
type TProps = {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    service?: string;
    search?: string;
  };
};
export default function InventoryReportPage({ searchParams }: TProps) {
  const clients = getClientsData();
  return (
    <div className="space-y-5">
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="Total Products" amount={0} />
        <Calculation content="Total Supplies" amount={0} />
      </div>
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
          <button className="flex max-w-80 items-center gap-2 rounded-lg border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600">
            <span>Filter</span>
          </button>
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
      {/* Table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-center">Product #</th>
              <th className="border-b px-4 py-2 text-center">Name </th>
              <th className="border-b px-4 py-2 text-center">Average Cost</th>
              <th className="border-b px-4 py-2 text-center">Average Sell</th>
              <th className="border-b px-4 py-2 text-center">Stock Qty.</th>
              <th className="border-b px-4 py-2 text-center">Qty. Sold</th>
              <th className="border-b px-4 py-2 text-center">Type</th>
              <th className="border-b px-4 py-2 text-center">ROI Average</th>
              <th className="border-b px-4 py-2 text-center">Forecast</th>
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
                  <Link className="text-blue-500" href={`/client/${client.id}`}>
                    {client.name}
                  </Link>
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.email}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.phone}
                </td>
                <td className="border-b px-4 py-2 text-center">
                  {client.phone}
                </td>
                <td className="border-b px-4 py-2 text-center">0</td>
                <td className="border-b px-4 py-2 text-center">0</td>
                <td className="border-b px-4 py-2 text-center">0</td>
                <td className="border-b px-4 py-2 text-center"></td>
                <td className="border-b px-4 py-2 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Analytics />
    </div>
  );
}
