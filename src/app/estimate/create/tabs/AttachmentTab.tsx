import { ImagesInput } from "./ImagesInput";
import { TasksInput } from "./TasksInput";

export function AttachmentTab() {
  return (
    <>
      <h2 className="mb-3 font-bold">Internal</h2>
      <div className="grid grid-cols-2 gap-3">
        <ImagesInput />
        <TasksInput />
        <textarea
          className="col-span-full rounded border border-solid border-slate-500 p-2"
          name="internal-notes"
          rows={5}
          placeholder="Internal Job Notes..."
        />
        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="internal-t&c"
          rows={5}
          placeholder="Terms and Conditions..."
        />
        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="internal-p&g"
          rows={5}
          placeholder="Policy and Guidelines..."
        />
      </div>
      <h2 className="mb-3 font-bold">Customer</h2>
      <div className="grid grid-cols-2 gap-3">
        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="customer-notes"
          rows={5}
          placeholder="Notes..."
        />
        <textarea
          className="rounded border border-solid border-slate-500 p-2"
          name="customer-comments"
          rows={5}
          placeholder="Comments..."
        />
      </div>
    </>
  );
}
