export interface EmployeeType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employee_type: "Salary" | "Hourly" | "Contract Based";
  employee_department: "Sales" | "Management" | "Workshop";
}
