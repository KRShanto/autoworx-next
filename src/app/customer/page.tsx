import CustomerList from "./CustomerList";
import Header from "./Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomerPage() {
  return (
    <div>
      <Header />
      <CustomerList />
    </div>
  );
}
