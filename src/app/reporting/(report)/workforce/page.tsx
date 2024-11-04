import Calculation from "../../components/Calculation";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import { cn } from "@/lib/cn";
import { getClientsData } from "../../data";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import FilterBySelection from "../../components/filter/FilterBySelection";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { Session } from "next-auth";
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
  },
  {
    id: 2,
    type: "cost",
    min: 0,
    max: 400,
    // defaultValue: [100, 300],
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];
export default async function WorkforceReportPage({ searchParams }: TProps) {
  const session: any = await auth();

  // TODO: fetching only technicians for now.
  const employees = await db.user.findMany({
    where: {
      companyId: session?.user?.companyId,
      employeeType: "Technician",
    },
    include: {
      Technician: true,
    },
  });

  const totalPayout = employees.reduce((acc, cur) => {
    const { Technician } = cur;
    const totalPayoutOfTechnician = Technician.reduce((acc, cur) => {
      if (cur.status === "Complete") {
        return acc + Number(cur?.amount);
      } else {
        return acc;
      }
    }, 0);
    return acc + totalPayoutOfTechnician;
  }, 0);
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
          <FilterByMultiple
            searchParamsValue={searchParams}
            filterSliders={filterMultipleSliders}
          />
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
        <Calculation content="Total Payout" amount={totalPayout} />
        <Calculation content="Overall Technician Performance" amount={0} />
        <Calculation content="Overall Sales Performance" amount={0} />
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
            </tr>
          </thead>

          <tbody>
            {employees.map((employee, index) => {
              const jobsCompleted: number = employee.Technician?.reduce(
                (acc, cur) => {
                  if (cur.status === "Complete") {
                    return acc + 1;
                  } else {
                    return acc;
                  }
                },
                0,
              );

              const totalPayout =
                employee.Technician?.length > 0
                  ? employee.Technician.reduce((acc, cur) => {
                      if (cur.status === "Complete") {
                        return acc + Number(cur?.amount);
                      } else {
                        return acc;
                      }
                    }, 0)
                  : 0;

              return (
                <tr
                  key={employee.id}
                  className={cn(
                    "cursor-pointer rounded-md py-3",
                    index % 2 === 0 ? "bg-white" : "bg-blue-100",
                  )}
                >
                  <td className="border-b px-4 py-2 text-center">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    {employee.employeeType}
                  </td>
                  <td className="border-b px-4 py-2 text-center">
                    ${totalPayout}
                  </td>
                  <td className="border-b px-4 py-2 text-center"></td>
                  <td className={cn("border-b px-4 py-2 text-center")}>
                    {jobsCompleted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
