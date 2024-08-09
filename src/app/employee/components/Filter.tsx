import { useEffect, useRef, useState } from "react";
import SliderRange from "./SliderRange";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";

export default function Filter() {
  const [amount, setAmount] = useState<[number, number]>([1, 3000]);
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setFilter } = useEmployeeWorkFilterStore();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSliderChange = (newValue: [number, number]) => {
    setAmount(newValue);
  };

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowFilter(false);
    }
  };

  const onApply = () => {
    setFilter({
      amount,
    });
    setShowFilter(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex h-[40px] w-[100px] items-center justify-center rounded border border-[#66738C] p-2 text-gray-400"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        Filter
      </button>

      {showFilter && (
        <div className="absolute z-40">
          <div className="mt-2 w-[400px] rounded border border-[#66738C] bg-white p-4 shadow-md">
            <div className="mb-4">
              <div className="font-Inter mb-2">Total Payout</div>
              <div className="flex items-center space-x-2">
                <span className="mr-2">${amount[0]}</span>
                <SliderRange value={amount} onChange={handleSliderChange} />
                <span className="ml-4">${amount[1]}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={onApply}
              >
                Apply
              </button>
              <button
                className="rounded border border-gray-300 px-4 py-2"
                onClick={() => {
                  setAmount([1, 3000]);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
