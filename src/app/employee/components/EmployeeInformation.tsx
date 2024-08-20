import Image from "next/image";
import Payout from "./Payout";
import { IoMdSettings } from "react-icons/io";
import { User } from "@prisma/client";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import Avatar from "@/components/Avatar";

export default function EmployeeInformation({
  employee,
  info,
}: {
  employee: User;
  info: EmployeeWorkInfo;
}) {
  return (
    <div className="mb-8 mt-5 flex w-full justify-between gap-5 px-4">
      <div className="relative flex w-full items-center rounded border border-gray-300 bg-white p-3">
        <div className="absolute left-3 top-3">
          <button>
            <IoMdSettings />
          </button>
        </div>
        <div className="mr-3 flex flex-col items-center">
          <Avatar photo={employee.image} width={100} height={100} />

          <div className="mt-2 text-gray-600">{employee.employeeType}</div>
        </div>

        <div className="w-full text-sm">
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Name</label>
            <input
              type="text"
              value={`${employee.firstName} ${employee.lastName}`}
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Email</label>
            <input
              type="email"
              value={employee.email}
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="mb-1 flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Phone</label>
            <input
              type="text"
              value={employee.phone!}
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-6 block w-20 text-gray-600">Address</label>
            <input
              type="text"
              value={employee.address!}
              readOnly
              className="block w-full rounded border border-gray-300 p-1 text-gray-600"
            />
          </div>
        </div>
      </div>

      <Payout info={info} />
    </div>
  );
}
