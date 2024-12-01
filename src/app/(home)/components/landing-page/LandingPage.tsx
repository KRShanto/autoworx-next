import { Chakra_Petch } from "next/font/google";
import Navbar from "./Navbar";

const chakra_petch = Chakra_Petch({ subsets: ["latin"], weight: "500" });

export default function LandingPage() {
  return (
    <div style={chakra_petch.style} className="text-black">
      <Navbar />
    </div>
  );
}
