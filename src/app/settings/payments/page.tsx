/* eslint-disable @next/next/no-img-element */
import { SlimInput } from "@/components/SlimInput";
import { cn } from "@/lib/cn";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col space-y-5 px-5">
      <h2 className="text-lg font-semibold">Payment Integration</h2>

      <div className="payment-integration-card rounded-lg border bg-white p-6 text-center shadow-lg">
        <div className="my-4 flex items-center justify-center">
          <img src="/icons/Logo2.png" alt="Autoworx" className="h-12 w-12" />
          <span className="mx-4 text-2xl">↔️</span>
          <img src="/icons/stripe.png" alt="Stripe" className="h-12 w-12" />
        </div>
        <p className="my-2 text-xl font-medium">Connect Autoworx to Stripe</p>
        <p className="mb-4 text-gray-500">
          Use Stripe to handle all your payments-related needs, manage revenue
          operations
        </p>
        <div className="flex justify-center space-x-4">
          <button className="rounded-lg border border-[#6571ff] px-4 py-2 text-[#6571ff] hover:bg-blue-50">
            More Info
          </button>
          <button
            // onClick={onAllowAccess}
            className="rounded-lg bg-[#6571ff] px-4 py-2 text-white hover:bg-blue-700"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
}
