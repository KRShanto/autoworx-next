import EmployeeInformation from "../components/EmployeeInformation";
import Header from "../components/Header";
import EmployeeWorkInformation from "../components/EmployeeWorkInformation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const employee = await db.user.findUnique({
    where: { id: parseInt(params.id) },
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
        },
      },
    },
  });

  return (
    <>
      <Header />
      <EmployeeInformation employee={employee} info={technicians} />
      <EmployeeWorkInformation info={technicians} />
    </>
  );
}
