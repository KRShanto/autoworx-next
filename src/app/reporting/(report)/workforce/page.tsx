import { auth } from "@/app/auth";
import { cn } from "@/lib/cn";
import { db } from "@/lib/db";
import Calculation from "../../components/Calculation";

import FilterHeader from "./FilterHeader";
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
      // employeeType: "Technician",
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

  // total payout for technician
  const totalPayoutForTechnician = employees.reduce((acc, cur) => {
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
      <FilterHeader
        filterMultipleSliders={filterMultipleSliders}
        searchParams={searchParams}
      />
      <div className="my-7 grid grid-cols-5 gap-4">
        <Calculation content="Total Payout" amount={totalPayout} />
        <Calculation
          content="Overall Technician Performance"
          amount={totalPayoutForTechnician}
        />
        {/* TODO */}
        <Calculation content="Overall Sales Performance" amount={0} />
      </div>
      {/* Table */}
      <div>
        <table className="w-full shadow-md">
          <thead className="bg-white">
            <tr className="h-10 border-b">
              <th className="border-b px-4 py-2 text-left">Employee</th>
              <th className="border-b px-4 py-2 text-left">Employee Type </th>
              <th className="border-b px-4 py-2 text-left">Total Payout</th>
              <th className="border-b px-4 py-2 text-left">Attendance</th>
              <th className="border-b px-4 py-2 text-left"># Jobs Completed</th>
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
                  <td className="border-b px-4 py-2 text-left">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    {employee.employeeType}
                  </td>
                  <td className="border-b px-4 py-2 text-left">
                    ${totalPayout}
                  </td>
                  <td className="border-b px-4 py-2 text-left"></td>
                  <td className={cn("border-b px-4 py-2 text-left")}>
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
