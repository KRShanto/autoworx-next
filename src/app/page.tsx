import Title from "@/components/Title";
import { auth } from "./auth";

export default async function Page() {
  const session = await auth();
  console.log(session);

  return <Title>Dashboard</Title>;
}
