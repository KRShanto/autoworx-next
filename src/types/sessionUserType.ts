import { EmployeeType } from "@prisma/client";
export default interface SessionUserType {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  companyId: number;
  employeeType: string;
}
