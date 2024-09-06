"use client";
import { SlimInput } from "@/components/SlimInput";
import { Select, Space } from "antd";
import { useEffect, useState } from "react";
import EmailTemplates from "./EmailTemplates";

interface CurrencyData {
  Code: string;
}

export default function EstimateAndInvoicePage() {
  const [currencies, setCurrencies] = useState<{ value: string }[]>([]);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/manishtiwari25/d3984385b1cb200b98bcde6902671599/raw/9f4441f9955c97996461ff58aca6715cfa0da597/world_currency_symbols.json",
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: CurrencyData[]) => {
        const uniqueCurrencies = Array.from(
          new Set(
            data
              .filter(
                (currency) => currency.Code && currency.Code.trim() !== "",
              )
              .map((currency) => currency.Code),
          ),
        ).map((code) => ({
          value: code,
          label: code,
        }));

        setCurrencies(uniqueCurrencies);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div className="grid w-full grid-cols-2 items-start gap-4 px-5">
      <div className="space-y-4">
        {/* Currency & Tax */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Currency & Tax</h2>
          <div className="space-y-3 rounded-sm border bg-white p-5">
            <div className="flex items-center justify-evenly gap-2">
              <SlimInput
                name="taxAmount"
                label="Tax Amount"
                className="w-[320px]"
              />
              <div className="flex flex-col items-start">
                <div className="mb-1 px-2 font-medium">Currency</div>
                <Select
                  showSearch
                  defaultValue="USD"
                  className="h-[30px] w-[320px]"
                  filterOption={(input, option) =>
                    (option?.value ?? " ")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={handleChange}
                  options={currencies}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {/* Terms & Conditions */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Terms & Conditions</h2>
          <div className="space-y-3 rounded-sm border bg-white p-5">
            <div className="grid grid-cols-2 items-start space-x-3">
              <label className="block">
                <div className="mb-1 px-2 font-medium">Terms & Conditions</div>
                <textarea
                  value='"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
'
                  className="h-60 w-full resize-none rounded-sm border border-primary-foreground bg-white px-2 py-0.5 text-sm leading-6 outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1 px-2 font-medium">Policy</div>
                <textarea
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                  className="h-60 w-full resize-none rounded-sm border border-primary-foreground bg-white px-2 py-0.5 text-sm leading-6 outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {/* Authorization */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Authorization</h2>
          <div className="space-y-3 rounded-sm border bg-white p-5">
            {/* TODO: future added */}
          </div>
        </div>
      </div>

      {/* Email templates section */}
      <div className="space-y-4 w-full">
        <EmailTemplates />
      </div>
    </div>
  );
}
