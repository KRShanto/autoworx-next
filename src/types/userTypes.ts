import { EmployeeType } from "@prisma/client";

export default interface UserTypes {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  employeeType: EmployeeType;
  companyId: number;
}
