"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { ImagesInput } from "./ImagesInput";
import { TasksInput } from "./TasksInput";

export function AttachmentTab() {
  const {
    internalNotes,
    terms,
    policy,
    customerNotes,
    customerComments,
    setInternalNotes,
    setTerms,
    setPolicy,
    setCustomerNotes,
    setCustomerComments,
  } = useEstimateCreateStore();

  return (
    <>
      <h2 className="mb-3 font-bold">Internal</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ImagesInput />
        <TasksInput />

        <textarea
          className="col-span-full rounded border border-solid border-slate-500 p-2"
          name="internal-notes"
          rows={5}
          placeholder="Internal Job Notes..."
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.currentTarget.value)}
        />

        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="internal-t&c"
          rows={5}
          placeholder="Terms and Conditions..."
          value={terms}
          onChange={(e) => setTerms(e.currentTarget.value)}
        />

        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="internal-p&g"
          rows={5}
          placeholder="Policy and Guidelines..."
          value={policy}
          onChange={(e) => setPolicy(e.currentTarget.value)}
        />
      </div>

      <h2 className="mb-3 font-bold">Customer</h2>

      <div className="grid grid-cols-2 gap-3">
        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="customer-notes"
          rows={5}
          placeholder="Notes..."
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.currentTarget.value)}
        />

        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="customer-comments"
          rows={5}
          placeholder="Comments..."
          value={customerComments}
          onChange={(e) => setCustomerComments(e.currentTarget.value)}
        />
      </div>
    </>
  );
}
