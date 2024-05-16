"use client";

export function BillSummary() {
  return (
    <>
      <div className="space-y-2 p-3">
        {[
          ["subtotal", "$0.00"],
          ["discount", "$0.00"],
          ["tax", "$0.00"],
          ["grand total", "$0.00"],
          ["deposit", "$0.00"],
          ["due", "$0.00"],
        ].map(([title, data]) => (
          <div
            key={title}
            className="flex rounded-md border border-solid border-slate-600"
          >
            <div className="mr-auto px-2 py-1 uppercase">{title}</div>
            <div className="rounded-md bg-slate-500 px-2 py-1 text-white">
              {data}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-md bg-[#006d77] p-3 text-white">
        <dl className="flex justify-between">
          <dt>Grand Total</dt> <dd>$0.00</dd>
        </dl>
        <button
          type="button"
          className="w-full rounded-md bg-white p-2 text-[#006d77]"
        >
          Make Payment
        </button>
      </div>
    </>
  );
}
