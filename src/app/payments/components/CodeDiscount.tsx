import { SlimInput } from "@/components/SlimInput";
import React, { useState } from "react";

interface DiscountInputProps {
  defaultDiscountType?: string;
  defaultDiscountValue?: string;
}

const DiscountInput = ({
  defaultDiscountType = "$",
  defaultDiscountValue = "",
}: DiscountInputProps) => {
  const [discountType, setDiscountType] = useState(defaultDiscountType);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountType(e.target.value);
  };

  return (
    <div className="flex items-center space-x-4">
      <SlimInput
        name="discountValue"
        label="Discount"
        style={{ width: "150px" }}
        defaultValue={defaultDiscountValue}
      />
      <div className="flex flex-col items-center">
        <p className="mb-2">$</p>
        <input
          name="discountType"
          type="radio"
          value="$"
          checked={discountType === "Fixed" || discountType === "$"}
          onChange={handleRadioChange}
          className="mb-2"
        />
      </div>
      <div className="flex flex-col items-center">
        <span className="mb-2">%</span>
        <input
          name="discountType"
          type="radio"
          value="%"
          checked={discountType === "Percentage" || discountType === "%"}
          onChange={handleRadioChange}
          className="mb-2"
        />
      </div>
    </div>
  );
};

interface CouponCodeProps {
  defaultValue?: string;
}
const CouponCode = ({ defaultValue = "      " }: CouponCodeProps) => {
  const [code, setCode] = useState(
    defaultValue.padEnd(6, "").split("").slice(0, 6),
  );

  const generateCode = () => {
    const newCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10).toString(),
    );
    setCode(newCode);
  };

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  return (
    <>
      {/* hidden input */}
      <input
        className="hidden"
        type="hidden"
        name="couponCode"
        value={code.join("")}
      />

      <div className="flex items-center space-x-4">
        <div className="flex space-x-1">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="h-10 w-10 rounded border border-primary-foreground text-center"
            />
          ))}
        </div>
        <button
          onClick={generateCode}
          className="rounded bg-blue-500 px-4 py-2 text-white"
          type="button"
        >
          Generate Code
        </button>
      </div>
    </>
  );
};

export { DiscountInput, CouponCode };
