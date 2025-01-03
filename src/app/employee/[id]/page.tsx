import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EmployeeInformation from "../components/EmployeeInformation";
import EmployeeWorkInformation from "../components/EmployeeWorkInformation";
import Header from "../components/Header";
import { getCompanyId } from "@/lib/companyId";

export default async function Page({ params }: { params: { id: string } }) {
  const companyId = await getCompanyId();
  const employee = await db.user.findUnique({
    where: { id: parseInt(params.id), companyId },
  });

  if (!employee) return notFound();

  // TODO: don't fetch "technicians" if the employee is not a technician
  const technicians = await db.technician.findMany({
    where: { userId: employee.id },
    include: {
      invoice: {
        include: {
          client: true,
          vehicle: true,
          invoiceItems: {
            include: {
              service: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header />
      <EmployeeInformation employee={employee} info={technicians} />
      <EmployeeWorkInformation
        info={technicians}
        employeeType={employee.employeeType}
      />
    </>
  );
}
