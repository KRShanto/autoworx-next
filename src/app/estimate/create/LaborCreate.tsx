import SelectCategory from "@/components/Lists/SelectCategory";
import { SelectTags } from "@/components/Lists/SelectTags";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import { Category, Tag } from "@prisma/client";
import { useEffect, useState } from "react";
import { newLabor } from "../../../actions/estimate/labor/newLabor";
import Close from "./CloseEstimate";
import { errorToast } from "@/lib/toast";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { laborCreateValidationSchema } from "@/validations/schemas/estimate/labor/labor.validation";

export default function LaborCreate() {
  const { categories } = useListsStore();
  const { currentSelectedCategoryId } = useEstimateCreateStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [hours, setHours] = useState<number>();
  const [charge, setCharge] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [addToCannedLabor, setAddToCannedLabor] = useState<boolean>(false);

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;

  const [tagsOpen, setTagsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);

  useEffect(() => {
    setTagsOpen(false);
  }, [categoryOpen]);
  useEffect(() => {
    setCategoryOpen(false);
  }, [tagsOpen]);

  useEffect(() => {
    if (data?.labor && data.edit) {
      console.log("hello there");
      setName(data.labor.name);
      setCategory(categories.find((cat) => cat.id === data.labor.categoryId)!);
      setTags(data.labor.tags);
      setNotes(data.labor.notes);
      setHours(data.labor.hours == 0 ? undefined : data.labor.hours);
      setCharge(data.labor.charge == 0 ? undefined : data.labor.charge);
      setDiscount(data.labor.discount == 0 ? undefined : data.labor.discount);
      setAddToCannedLabor(data.labor.addToCannedLabor);
    } else {
      setName("");
      setCategory(null);
      setTags([]);
      setNotes("");
      setHours(undefined);
      setCharge(undefined);
      setDiscount(undefined);
      setAddToCannedLabor(false);
    }
  }, [data]);

  console.log("discount", discount);

  async function handleSubmit() {
    // if (!name) {
    //   alert("Labor name is required");
    //   return;
    // }

    try {
      const validatedLaborData = await laborCreateValidationSchema.parseAsync({
        name,
        categoryId: category?.id,
        tags,
        notes,
        hours: hours ?? 0,
        charge: charge ?? 0,
        discount: discount ?? 0,
        cannedLabor: addToCannedLabor,
      });
      if (addToCannedLabor) {
        const res = await newLabor(validatedLaborData);
        if (res.type === "globalError") {
          errorToast(
            res.errorSource?.length ? res.errorSource[0].message : res.message,
          );
        }
      }

      // if (res.type === "success") {
      //   console.log("Labor has been created", res.data);

      // Change the service where itemId is the same
      // @ts-ignore
      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              labor: {
                ...item.labor,
                name,
                categoryId: Number(category?.id),
                tags,
                notes,
                hours: Number(hours),
                charge: Number(charge),
                discount: Number(discount),
                addToCannedLabor,
              },
            };
          }
          return item;
        });
        return { items };
      });

      // Add to listsStore
      // @ts-ignore
      useListsStore.setState((state) => {
        return {
          labors: [
            ...state.labors,
            {
              id: 1,
              name,
              categoryId: Number(category?.id),
              tags,
              notes,
              hours: Number(hours),
              charge: Number(charge),
              discount: Number(discount),
              addToCannedLabor,
            },
          ],
        };
      });

      close();
    } catch (error) {
      const formattedError = errorHandler(error);
      errorToast(
        formattedError.errorSource?.length
          ? formattedError.errorSource[0].message
          : formattedError.message,
      );
    }
  }
  // }

  async function handleEdit() {
    if (!name) {
      alert("Labor name is required");
      return;
    }

    // Change the service where itemId is the same
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            labor: {
              ...item.labor,
              name,
              categoryId: category?.id,
              tags,
              notes,
              hours,
              charge,
              discount,
              addToCannedLabor,
            },
          };
        }
        return item;
      });
      return { items };
    });
    close();
  }

  return (
    <div className="flex flex-col gap-2 p-10 md:p-5">
      <h3 className="w-full text-xl font-semibold">
        {data?.edit ? "Edit Labor Information" : "Labor Information"}
      </h3>

      <div className="flex items-center gap-2">
        <label htmlFor="name" className="w-28 text-end text-sm">
          Labor Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <SelectCategory
        onCategoryChange={setCategory}
        labelPosition="left"
        categoryData={category}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
      />

      <div className="flex items-center gap-2">
        <label htmlFor="tags" className="w-28 text-end text-sm">
          Tags
        </label>
        <div className="w-full">
          <SelectTags
            value={tags}
            setValue={setTags}
            openStates={[tagsOpen, setTagsOpen]}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="notes" className="w-28 text-end text-sm">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-30 w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="hours" className="w-28 text-end text-sm">
          No. of Hours
        </label>
        <input
          type="number"
          id="hours"
          value={hours}
          onChange={(e) => setHours(parseFloat(e.target.value))}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="perhour" className="w-28 text-end text-sm">
          $/hr
        </label>
        <input
          type="number"
          id="perhour"
          value={charge}
          onChange={(e) => setCharge(parseFloat(e.target.value))}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="discount" className="w-28 text-end text-sm">
          Discount
        </label>
        <input
          type="number"
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
          placeholder="0.00"
        />
      </div>

      {!data.edit && (
        <div className="ml-3 flex items-center gap-5">
          <input
            id="check"
            type="checkbox"
            checked={addToCannedLabor}
            onChange={(e) => setAddToCannedLabor(e.target.checked)}
          />
          <label htmlFor="check">Add to Canned Labor</label>
        </div>
      )}

      <div className="flex justify-center gap-5">
        <Close />
        <button
          className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
          onClick={data?.edit ? handleEdit : handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
