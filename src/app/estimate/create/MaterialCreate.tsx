import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { useListsStore } from "@/stores/lists";
import React, { useEffect, useState } from "react";
import { Category, Tag, Vendor } from "@prisma/client";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import Selector from "@/components/Selector";
import { newMaterial } from "./actions/newMaterial";
import NewVendor from "@/components/Lists/NewVendor";
import Close from "./CloseEstimate";
import { SelectTags } from "@/components/Lists/SelectTags";
import SelectCategory from "@/components/Lists/SelectCategory";

export default function MaterialCreate() {
  const { categories } = useListsStore();
  const { vendors } = useListsStore();

  const [vendorsToDisplay, setVendorsToDisplay] = useState<Vendor[]>([]);

  const { currentSelectedCategoryId } = useEstimateCreateStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [quantity, setQuantity] = useState<number>();
  const [cost, setCost] = useState<number>();
  const [sell, setSell] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [addToInventory, setAddToInventory] = useState<boolean>(false);

  const { close, data } = useEstimatePopupStore();
  const itemId = data?.itemId;
  const materialIndex = data?.materialIndex;

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");

  useEffect(() => {
    if (data.material && data.edit) {
      setName(data.material.name);
      setCategory(
        data.material.categoryId
          ? categories.find((cat) => cat.id === data.material.categoryId)!
          : null,
      );
      setVendor(
        data.material.vendorId
          ? vendors.find((ven) => ven.id === data.material.vendorId)!
          : null,
      );
      setTags(data.material.tags || []);
      setNotes(data.material.notes || "");
      setQuantity(data.material.quantity || 0);
      setCost(data.material.cost || 0);
      setSell(data.material.sell || 0);
      setDiscount(data.material.discount || 0);
      setAddToInventory(data.material.addToInventory || false);
    } else {
      setName("");
      setCategory(null);
      setVendor(null);
      setTags([]);
      setNotes("");
      setQuantity(0);
      setCost(0);
      setSell(0);
      setDiscount(0);
      setAddToInventory(false);
    }
  }, [data]);

  useEffect(() => {
    if (currentSelectedCategoryId) {
      setCategory(
        categories.find((cat) => cat.id === currentSelectedCategoryId)!,
      );
    }
  }, [currentSelectedCategoryId]);

  useEffect(() => {
    if (vendorSearch) {
      setVendorsToDisplay(
        vendors.filter((ven) =>
          ven.name.toLowerCase().includes(vendorSearch.toLowerCase()),
        ),
      );
    } else {
      setVendorsToDisplay(vendors.slice(0, 4));
    }
  }, [vendorSearch, vendors]);

  async function handleSubmit() {
    if (!name) {
      alert("Material name is required");
      return;
    }

    const res = await newMaterial({
      name,
      categoryId: category?.id,
      vendorId: vendor?.id,
      tags,
      notes,
      quantity: quantity || 0,
      cost: cost || 0,
      sell: sell || 0,
      discount: discount || 0,
      addToInventory,
    });

    if (res.type === "success") {
      // Change the service where itemId is the same
      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              material: res.data,
            };
          }
          return item;
        });
        return { items };
      });

      // Add to listsStore
      useListsStore.setState((state) => {
        return { materials: [...state.materials, res.data] };
      });

      close();
    }
  }

  async function handleEdit() {
    if (!name) {
      alert("Material name is required");
      return;
    }

    // Update the material in the items
    // @ts-ignore
    useEstimateCreateStore.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id === itemId) {
          const materials = item.materials.map((material, i) => {
            if (i === materialIndex) {
              return {
                ...material,
                name,
                categoryId: category?.id,
                vendorId: vendor?.id,
                tags,
                notes,
                quantity: quantity || 0,
                cost: cost || 0,
                sell: sell || 0,
                discount: discount || 0,
                addToInventory,
              };
            }
            return material;
          });

          return {
            ...item,
            materials,
          };
        }
        return item;
      });
      return { items };
    });

    close();
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      <h3 className="w-full text-xl font-semibold">
        {/* Materials/Parts Information */}
        {data.edit ? "Edit Materials/Parts" : "Materials/Parts Information"}
      </h3>

      <div className="flex items-center gap-2">
        <label htmlFor="name" className="w-28 text-end text-sm">
          Material/
          <br /> Parts Name
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
        showLabelAsValue={false}
        labelPosition="left"
        categoryData={category}
      />

      <div className="flex items-center gap-2">
        <label className="w-28 text-end text-sm">Vendor</label>
        <Selector
          label={vendor ? vendor.name || "Vendor" : ""}
          openState={[vendorOpen, setVendorOpen]}
          setSearch={setVendorSearch}
          newButton={
            <NewVendor
              button={
                <button type="button" className="text-xs text-[#6571FF]">
                  + New Vendor
                </button>
              }
              afterSubmit={(vendor) => {
                useListsStore.setState(({ vendors }) => ({
                  vendors: [...vendors, vendor],
                }));

                useEstimateCreateStore.setState((state) => {
                  const items = state.items.map((item) => {
                    if (item.id === itemId) {
                      return {
                        ...item,
                        vendor,
                      };
                    }
                    return item;
                  });
                  return { items };
                });

                setVendor(vendor);
                setVendorOpen(false);
              }}
            />
          }
        >
          <div>
            {vendorsToDisplay.map((ven) => (
              <button
                type="button"
                key={ven.id}
                onClick={() => setVendor(ven)}
                className="mx-auto my-1 block w-[90%] rounded-md border-2 border-slate-400 p-1 text-center hover:bg-slate-200"
              >
                {ven.name}
              </button>
            ))}
          </div>
        </Selector>
      </div>

      {/* TODO: add to backend */}
      <div className="flex items-center gap-2">
        <label htmlFor="tags" className="w-28 text-end text-sm">
          Tags
        </label>
        <div className="w-full">
          <SelectTags value={tags} setValue={setTags} />
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
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="qt" className="w-28 text-end text-sm">
          Quantity
        </label>
        <input
          type="number"
          id="qt"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="price" className="w-28 text-end text-sm">
          Cost Price
        </label>
        <input
          type="number"
          id="price"
          value={cost}
          onChange={(e) => setCost(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sell" className="w-28 text-end text-sm">
          Sell Price
        </label>
        <input
          type="number"
          id="sell"
          value={sell}
          onChange={(e) => setSell(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
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
          onChange={(e) => setDiscount(+e.target.value)}
          className="w-full rounded-md border-2 border-slate-400 p-1 text-xs"
        />
      </div>

      <label className="ml-5 flex items-center gap-2">
        <input
          type="checkbox"
          checked={addToInventory}
          onChange={(e) => setAddToInventory(e.target.checked)}
        />
        <span>Add to Inventory</span>
      </label>

      <div className="flex justify-center gap-5">
        <Close />
        <button
          className="w-fit rounded-md bg-[#6571FF] p-1 px-5 text-white"
          onClick={data.edit ? handleEdit : handleSubmit}
          type="button"
        >
          Done
        </button>
      </div>
    </div>
  );
}
