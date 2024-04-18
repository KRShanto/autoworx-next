import { useInvoiceStore } from "../../../stores/invoice";
import { useEffect } from "react";

export default function AdditionalInfo({
  notes,
  terms,
  policy,
}: {
  notes: string;
  terms: string;
  policy: string;
}) {
  const { additional, setAdditional } = useInvoiceStore();

  useEffect(() => {
    setAdditional({
      notes: notes,
      terms: terms,
      policy: policy,
    });
  }, [notes, terms, policy]);

  return (
    <>
      {/* Add Notes */}
      <textarea
        name="notes"
        id="notes"
        className="w-[15%] resize-none h-24 p-1 px-2 invoice-inner-shadow border-none text-black additional"
        placeholder="Add Notes"
        value={additional.notes}
        onChange={(e) =>
          setAdditional({ ...additional, notes: e.target.value })
        }
      ></textarea>

      {/* Terms & Conditions */}
      <textarea
        name="terms"
        id="terms"
        className="w-[15%] resize-none h-24 p-1 px-2 invoice-inner-shadow border-none text-black additional"
        placeholder="Terms & Conditions"
        value={additional.terms}
        onChange={(e) =>
          setAdditional({ ...additional, terms: e.target.value })
        }
      ></textarea>

      <div className="w-[45%] flex flex-wrap gap-2 items-start max-[1500px]:text-xs">
        <div className="flex items-center gap-2">
          <input type="checkbox" name="order" id="order" className="text-sm" />
          <label htmlFor="order">Order Material</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="deposit" id="deposit" />
          <label htmlFor="deposit">Get Deposit</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="send" id="send" />
          <label htmlFor="send">Send Invoice</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="procurement" id="procurement" />
          <label htmlFor="procurement ">Part Procurement</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="schedule" id="schedule" />
          <label htmlFor="schedule">Schedule for Followup</label>
        </div>
      </div>
    </>
  );
}
