// CategorySelector.tsx
import newCategory from "@/actions/category/newCategory";
import Selector from "@/components/Selector";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export default function SelectCategory({
  categoryData,
  onCategoryChange,
  labelPosition = "top",
  categoryOpen,
  setCategoryOpen,
}: {
  categoryData?: Category | null;
  onCategoryChange: (category: Category) => void;
  labelPosition?: "top" | "left" | "none";
  categoryOpen?: boolean;
  setCategoryOpen?: any;
}) {
  const { categories } = useListsStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryInput, setCategoryInput] = useState("");
  // const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData as Category);
    } else {
      setCategory(null);
    }
  }, [categoryData]);

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
        label={(category: Category | null) =>
          category ? category.name || `Category ${category.id}` : "Category"
        }
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
        items={categories}
        displayList={(category: Category) => <p>{category.name}</p>}
        onSearch={(search: string) =>
          categories.filter((cat) =>
            cat.name.toLowerCase().includes(search.toLowerCase()),
          )
        }
        openState={[categoryOpen as boolean, setCategoryOpen]}
        selectedItem={category}
        setSelectedItem={setCategory}
      />
    </div>
  );
}
