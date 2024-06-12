import Title from "@/components/Title";
import { auth } from "./auth";

export default async function Page() {
  const session = await auth();
  console.log("from root page",session);

  return <Title>Dashboard</Title>;
}
