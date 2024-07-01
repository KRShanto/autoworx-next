// CategorySelector.tsx
import { Category } from "@prisma/client";
import { useState, useEffect } from "react";
import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { cn } from "@/lib/cn";
import newCategory from "@/app/estimate/create/actions/newCategory";

export default function SelectCategory({
  categoryData,
  onCategoryChange,
  showLabelAsValue,
  labelPosition = "top",
}: {
  categoryData?: Category | null;
  showLabelAsValue?: boolean;
  onCategoryChange: (category: Category) => void;
  labelPosition?: "top" | "left" | "none";
}) {
  const { categories } = useListsStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>(
    [],
  );
  const [categoryInput, setCategoryInput] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData as Category);
    } else {
      setCategory(null);
    }
  }, [categoryData]);

  useEffect(() => {
    if (categorySearch) {
      setCategoriesToDisplay(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
        ),
      );
    } else {
      setCategoriesToDisplay(categories.slice(0, 4));
    }
  }, [categorySearch, categories]);

  async function handleNewCategory() {
    const res = await newCategory({
      name: categoryInput,
    });

    if (res.type === "success") {
      useListsStore.setState((state) => {
        return { categories: [...state.categories, res.data] };
      });
      setCategory(res.data);
      setCategoryInput("");
      setCategoryOpen(false);
    }
  }

  useEffect(() => {
    if (category) {
      onCategoryChange(category);
    }
  }, [category]);

  return (
    <div
      className={cn({
        "flex items-center gap-2": labelPosition === "left",
      })}
    >
      {labelPosition !== "none" && (
        <label
          className={cn("text-semibold", {
            "w-28 text-end text-sm": labelPosition === "left",
          })}
        >
          Category
        </label>
      )}
      <Selector
        label={category ? category.name : showLabelAsValue ? "Category" : ""}
        openState={[categoryOpen, setCategoryOpen]}
        setSearch={setCategorySearch}
        newButton={
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Category Name"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="w-full rounded-md border-2 border-slate-400 p-1"
            />
            <button
              onClick={handleNewCategory}
              className={cn(
                "text-nowrap rounded-md px-2 text-white",
                categoryInput ? "bg-slate-700" : "bg-slate-400",
              )}
              type="button"
              disabled={!categoryInput}
            >
              Quick Add
            </button>
          </div>
        }
      >
        <div>
          {categoriesToDisplay.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat)}
              className={cn(
                "mx-auto my-1 block w-[90%] rounded-md border-2 border-slate-400 p-1 text-center hover:bg-slate-200",
                {
                  "bg-slate-300": category && category.id === cat.id,
                },
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Selector>
    </div>
  );
}
