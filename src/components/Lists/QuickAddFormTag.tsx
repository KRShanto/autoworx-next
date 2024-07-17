import Submit from "@/components/Submit";
import { useFormErrorStore } from "@/stores/form-error";
import { Status } from "@prisma/client";
import { useRef } from "react";
import { PiPaletteBold } from "react-icons/pi";
type SelectedColor = { textColor: string; bgColor: string } | null;

export default function QuickAddForm({
  onSuccess,
  setPickerOpen,
  selectedColor,
  tag,
  setTag,
  tagList,
  setTagList,
}: {
  onSuccess?: (value: Status) => void;
  setPickerOpen: any;
  selectedColor: SelectedColor;
  tag: any;
  setTag: any;
  tagList: any;
  setTagList: any;
}) {
  const { showError } = useFormErrorStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  async function handleSubmit(data: FormData) {
    setTagList([
      ...tagList,
      {
        id: tagList.length + 1,
        tag,
        bgColor: selectedColor?.bgColor,
        textColor: selectedColor?.textColor,
      },
    ]);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} className="flex gap-2 p-2">
      <input
        name="name"
        type="text"
        required
        className="flex-1 rounded-sm border border-solid border-black p-1"
        onChange={(e) => {
          setTag(e.target.value);
        }}
      />

      <button
        className="rounded bg-[#6470FF] p-2 text-white"
        onClick={() => setPickerOpen((prev: boolean) => !prev)}
        type="button"
      >
        <PiPaletteBold />
      </button>

      <Submit
        className="rounded bg-slate-500 p-1 text-xs leading-3 text-white"
        formAction={handleSubmit}
      >
        Quick
        <br /> Add
      </Submit>
    </form>
  );
}
