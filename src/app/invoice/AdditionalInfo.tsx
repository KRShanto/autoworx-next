import { INVOICE_TAGS } from "@/lib/consts";
import { useInvoiceStore } from "../../stores/invoice";
import { useEffect } from "react";

export default function AdditionalInfo({
  notes,
  terms,
}: {
  notes: string;
  terms: string;
}) {
  const { additional, tags, setTags, setAdditional } = useInvoiceStore();

  useEffect(() => {
    setAdditional({
      notes,
      terms,
    });
  }, [notes, terms]);

  return (
    <>
      {/* Add Notes */}
      <textarea
        name="notes"
        id="notes"
        className="invoice-inner-shadow additional h-24 w-[15%] resize-none border-none p-1 px-2 text-black"
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
        className="invoice-inner-shadow additional h-24 w-[15%] resize-none border-none p-1 px-2 text-black"
        placeholder="Terms & Conditions"
        value={additional.terms}
        onChange={(e) =>
          setAdditional({ ...additional, terms: e.target.value })
        }
      ></textarea>

      {/* Tags */}
      <div className="flex w-[45%] flex-wrap items-start gap-2 max-[1500px]:text-xs">
        {INVOICE_TAGS.map((tag, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={tag.name}
              id={tag.name}
              checked={tags.includes(tag.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  setTags([...tags, tag.name]);
                } else {
                  setTags(tags.filter((t) => t !== tag.name));
                }
              }}
            />
            <label htmlFor={tag.name}>{tag.title}</label>
          </div>
        ))}
      </div>
    </>
  );
}
