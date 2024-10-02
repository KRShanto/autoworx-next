type TProps = {
  content: string;
  amount: number;
};
export default function Calculation({ content, amount }: TProps) {
  return (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-y-5 rounded-lg border">
      <span className="text-lg">{content}</span>
      <span className="text-6xl font-bold">
        $ {parseFloat(String(amount)).toFixed(2)}
      </span>
    </div>
  );
}
