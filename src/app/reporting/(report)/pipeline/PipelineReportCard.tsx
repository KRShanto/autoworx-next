import { cn } from "@/lib/cn";

type TProps = {
  title: string;
  averageValue: string;
  icon: React.ReactNode;
  tradeValue: string;
};
export default function PipelineReportCard({
  averageValue,
  title,
  icon,
  tradeValue,
}: TProps) {
  const hasSignature = /[\$\%]/.test(averageValue);
  return (
    <div className="flex min-w-96 items-center justify-between rounded-md border p-5">
      <div className="space-y-2">
        <p className="text-2xl font-bold capitalize">{title}</p>
        <div
          className={cn("text-6xl font-bold", !hasSignature && "flex flex-col")}
        >
          {averageValue.split(" ").map((word: string, index: number) => {
            return (
              <span
                key={index}
                style={{
                  fontSize: !hasSignature && index !== 0 ? "21px" : "60px",
                  textTransform: "capitalize",
                }}
              >
                {word}
              </span>
            );
          })}
          {""}
        </div>
      </div>
      <div className="flex items-center text-[#4DB6AC]">
        {icon}
        <span className="text-xl font-bold">{tradeValue}</span>
      </div>
    </div>
  );
}
