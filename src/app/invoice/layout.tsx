import Title from "@/components/Title";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Title>Invoice</Title>
      <Navbar />
      {children}
    </div>
  );
}
