import Body from "./Body";
import Heading from "./Heading";

export default function Calender({ type }: { type: string }) {
  return (
    <div className="app-shadow relative mt-4 h-[98%] w-[1150px] overflow-hidden rounded-[18px] bg-white p-4">
      <Heading type={type as any} />
      <Body type={type as any} />
    </div>
  );
}
