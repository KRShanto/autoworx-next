import { useEffect, useRef, useState } from "react";
import SliderRange from "./SliderRange";
import { usePaymentFilterStore } from "@/stores/paymentFilter";

const FilterforPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<[number, number]>([1, 3000]);
  const [status, setStatus] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setFilter } = usePaymentFilterStore();

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
      paidStatus: status as any,
      paymentMethod: paymentMethod || "all",
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
              <div className="font-Inter mb-2">Payment Method</div>
              <div className="flex space-x-2">
                {["Method 1", "Method 2", "Method 3"].map((method) => (
                  <button
                    key={method}
                    className={` ${
                      paymentMethod === method
                        ? "flex h-[24px] w-[89px] items-center justify-center rounded border bg-blue-500 px-1 py-1 text-xs text-[white]"
                        : "text-[#66738C flex h-[24px] w-[89px] items-center justify-center rounded border border-gray-300 px-1 py-1 text-xs"
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="font-Inter mb-2">Amount</div>
              <div className="flex items-center space-x-2">
                <span className="mr-2">${amount[0]}</span>
                <SliderRange value={amount} onChange={handleSliderChange} />
                <span className="ml-4">${amount[1]}</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-Inter flex space-x-2">
                {["all", "paid", "unpaid"].map((statusOption) => (
                  <label
                    key={statusOption}
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={statusOption}
                      checked={status === statusOption}
                      onChange={() => setStatus(statusOption)}
                    />
                    <span>
                      {statusOption.charAt(0).toUpperCase() +
                        statusOption.slice(1)}
                    </span>
                  </label>
                ))}
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
                  setPaymentMethod(null);
                  setAmount([1, 30_000]);
                  setStatus("all");
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
};

export default FilterforPayment;
