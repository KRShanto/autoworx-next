import ServiceList from "./ServiceList";
import Header from "./Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicePage() {
  return (
    <div>
      <Header />
      <ServiceList />
    </div>
  );
}
