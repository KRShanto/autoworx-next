import { FaTimes, FaPlus } from "react-icons/fa";
import Popup from "@/components/Popup";
import { Customer, Service, Setting, User, Vehicle } from "@prisma/client";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewEmployeeForm from "./NewEmployeeForm";
import DeleteButton from "./DeleteButton";

export default async function Page({
  params,
}: {
  params: {
    id: string;
    workOrderId: string;
  };
}) {
  const { id, workOrderId } = params;

  // Get the invoice
  const invoice = await db.invoice.findUnique({
    where: { invoiceId: id },
  });

  if (!invoice) notFound();

  // Get the customer
  const customer = (await db.customer.findFirst({
    where: { id: invoice.customerId },
  })) as Customer;

  // Get the vehicle
  const vehicle = (await db.vehicle.findFirst({
    where: { id: invoice.vehicleId },
  })) as Vehicle;

  // Get the service IDs
  const serviceIds = invoice.serviceIds as number[];

  // Get the services
  const services = (await Promise.all(
    serviceIds.map(async (id) => {
      const service = await db.service.findUnique({ where: { id } });
      return service!;
    }),
  )) as Service[];

  // Get the employees
  const employees = (await db.user.findMany({
    where: { workOrderId: parseInt(workOrderId) },
    select: {
      id: true,
      name: true,
      workOrderId: true,
    },
  })) as User[];

  // Get all the employees who are not assigned to the work order
  console.log("work id: ", workOrderId);
  const otherEmployees = (await db.user.findMany({
    where: {
      role: "employee",
      companyId: invoice.companyId,
      OR: [
        { workOrderId: { not: parseInt(workOrderId) } },
        { workOrderId: null },
      ],
    },
    select: {
      id: true,
      name: true,
      workOrderId: true,
    },
  })) as User[];

  console.log("Other employees: ", otherEmployees);

  return (
    <Popup>
      <div className="w-[40rem] px-2 py-3">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-3xl font-bold">Work Invoice</h2>
          <Link href={`/invoice/view/${id}`}>
            <FaTimes />
          </Link>
        </div>

        {/* Details */}
        <div className="flex flex-row items-start justify-between p-5">
          <div>
            <h3 className="font-bold">Invoice To:</h3>
            <p>{customer.name}</p>
            <p>{customer.mobile}</p>
            <p>{customer.email}</p>
          </div>

          <div>
            <h3 className="font-bold">Vehicle:</h3>
            <p>{vehicle.year}</p>
            <p>{vehicle.make}</p>
            <p>{vehicle.model}</p>
            <p>{vehicle.vin}</p>
            <p>{vehicle.license}</p>
          </div>

          <div>
            <h3 className="font-bold">Invoice#{invoice.invoiceId}</h3>
            <p>{invoice.status}</p>
            {/* TODO: Vehicle drop date */}
            <p className="mt-1 w-[200px]">{invoice.notes}</p>
          </div>
        </div>

        <div className="flex flex-row items-start">
          {/* Product Table */}
          <table className="w-full">
            <thead>
              <tr className="flex w-[350px] justify-between gap-2 text-sm uppercase text-white">
                <th className="w-[250px] bg-[#6571FF] p-2 text-left">
                  Product name & Description
                </th>
                <th className="w-[100px] bg-[#6571FF] p-2 text-left">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service: any, index: number) => {
                const isEven = index % 2 === 0;
                const bgColor = isEven ? "bg-[#EAEAEA]" : "bg-[#F4F4F4]";

                return (
                  <tr
                    className="flex w-[350px] justify-between gap-2 text-lg text-black"
                    key={service.id}
                  >
                    <td className={`text-left ${bgColor} w-[250px] p-2`}>
                      {service.name}
                    </td>
                    <td className={`text-left ${bgColor} w-[100px] p-2`}>
                      {service.quantity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Employee List */}
          <div>
            <h3 className="w-[200px] bg-[#6571FF] p-2 text-center font-bold uppercase text-white">
              Employee List
            </h3>

            <div className="flex flex-col items-center">
              {employees.map((employee: User, index: number) => {
                const isEven = index % 2 === 0;
                const bgColor = isEven ? "bg-[#EAEAEA]" : "bg-[#F4F4F4]";

                return (
                  <div
                    key={employee.id}
                    className={`${bgColor} flex w-[200px] items-center justify-between p-2`}
                  >
                    <p>{employee.name}</p>
                    <DeleteButton employeeId={employee.id} />
                  </div>
                );
              })}
            </div>
            <NewEmployeeForm
              otherEmployees={otherEmployees}
              workOrderId={parseInt(workOrderId)}
              invoiceId={id}
            />
          </div>
        </div>

        <Link
          className="mx-auto mt-10 flex w-[50px] justify-center rounded-lg bg-[#6571FF] px-10 py-2 text-base text-white"
          href={`/invoice/view/${id}`}
        >
          Save
        </Link>
      </div>
    </Popup>
  );
}
