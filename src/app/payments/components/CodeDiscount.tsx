import { SlimInput } from "@/components/SlimInput";
import React, { useState } from "react";

const DiscountInput = () => {
  const [discountType, setDiscountType] = useState("$");

  const handleRadioChange = (e: any) => {
    setDiscountType(e.target.value);
  };

  return (
    <div className="flex items-center space-x-4">
      <SlimInput
        name="discountValue"
        label="Discount"
        style={{ width: "150px" }}
      />
      <div className="flex flex-col items-center">
        <p className="mb-2">$</p>
        <input
          name="discountType"
          type="radio"
          value="$"
          checked={discountType === "$"}
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
          checked={discountType === "%"}
          onChange={handleRadioChange}
          className="mb-2"
        />
      </div>
    </div>
  );
};

const CouponCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

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
