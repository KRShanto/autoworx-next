import { Chakra_Petch } from "next/font/google";
import Navbar from "./Navbar";
import First from "./first/First";
import Middle from "./Middle";
import Last from "./Last";

const chakra_petch = Chakra_Petch({ subsets: ["latin"], weight: "500" });

export default function LandingPage() {
  return (
    <div style={chakra_petch.style} className="text-black">
      <Navbar />
      {/* <First /> */}
      <Middle />
      {/* <Last /> */}
    </div>
  );
}
