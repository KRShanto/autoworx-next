import { SlimInput } from "@/components/SlimInput";
import { cn } from "@/lib/cn";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col space-y-5 p-5">
      {/* taxes */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">Taxes</h2>
          <button className="rounded-md bg-[#6571FF] px-3 py-1.5 text-white">
            +New
          </button>
        </div>
        <div className="relative max-h-[450px] w-[982px] overflow-y-auto rounded-md border p-5">
          <table className="w-full table-fixed">
            <thead>
              <tr className="*:sticky *:-top-5 *:h-11 *:w-full *:bg-[#F8F9FA]">
                <th>Name</th>
                <th>Rate</th>
                <th>Description</th>
                <th>Tax ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="rounded-md border text-center">
              {[...Array(12)].map((data, index) => (
                <tr
                  key={index}
                  className={cn("h-11", index % 2 === 0 && "bg-[#EEF4FF]")}
                >
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Receipts */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Receipts</h2>
        <div className="w-[982px] space-y-5 rounded-md border px-7 py-5">
          <SlimInput name="title" />
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div>
              <SlimInput name="receiptPrefix" label="Receipt Prefix" />
              <p>Prefix to be used while generating all receipts</p>
            </div>
            <div>
              <SlimInput
                name="receiptStartNumber"
                label="Receipt Start Number"
              />
              <p>
                Define the number to be used when creating the first receipt.
                The number will automatically increment with each receipt
                created
              </p>
            </div>
            <div>
              <SlimInput name="emailTemplate" label="Email Template" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
