import EmployeeList from "./EmployeeList";
import Header from "./Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees",
};

export default function EmployeePage() {
  return (
    <div>
      <Header />
      <EmployeeList />
    </div>
  );
}
