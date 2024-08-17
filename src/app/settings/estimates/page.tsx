import { SlimInput } from "@/components/SlimInput";

export default function EstimateAndInvoicePage() {
  return (
    <div className="grid w-full grid-cols-2 items-start gap-4 p-5">
      <div className="space-y-4">
        {/* Currency & Tax */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Currency & Tax</h2>
          <div className="space-y-3 rounded-sm border p-5">
            <div className="grid grid-cols-2 items-start space-x-3">
              <SlimInput name="taxAmount" label="Tax Amount" />
              <SlimInput name="currency" />
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
          <div className="space-y-3 rounded-sm border p-5">
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
          <div className="space-y-3 rounded-sm border p-5">
            {/* TODO: future added */}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {/* Custom Message for Sharing Estimate/Invoice */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Custom Message for Sharing Estimate/Invoice
          </h2>
          <div className="space-y-3 rounded-sm border p-5">
            <div className="grid grid-cols-1 items-start space-x-3">
              <label className="block">
                <div className="mb-1 px-2 font-medium">
                  The following message will be sent to the recipient when
                  sharing an Invoice/Estimate
                </div>
                <textarea
                  value='"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
'
                  className="h-32 w-full resize-none rounded-sm border border-primary-foreground bg-white px-2 py-0.5 text-sm leading-6 outline-none"
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
      </div>
    </div>
  );
}
