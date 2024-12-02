export function DecorativeDivider() {
  return (
    <div className="my-8 flex w-full items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="h-3.5 w-16 -skew-x-[30deg] transform bg-[#00A7E1]" />
        <div className="h-3.5 w-8 -skew-x-[30deg] transform bg-gray-400" />
      </div>
    </div>
  );
}
