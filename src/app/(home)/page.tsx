import { auth } from "../auth";
import Dashboard from "./components/dashboard/Dashboard";
import LandingPage from "./components/landing-page/LandingPage";

export default async function Page() {
  const session = await auth();

  if (session) return <Dashboard />;
  else return <LandingPage />;
}
