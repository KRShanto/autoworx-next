
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchTerms() {
    const { setFilter } = useEstimateFilterStore();

  return (
    <div className="relative min-w-0 flex-1">
      <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded border border-gray-300 p-2 pl-10"
        onChange={(e) => {
          setFilter({ search: e.target.value });
        }}
      />
    </div>
  );
}
