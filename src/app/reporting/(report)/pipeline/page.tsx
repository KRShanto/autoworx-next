import FilterDateRange from "../../components/filter/FilterByDateRange";
import PipelineCardContainer from "../../components/pipeline/PipelineCardContainer";
import PipelineBarChart from "../../components/pipeline/PipelineBarChart";
export default function PipelinePage() {
  return (
    <div className="grid grid-cols-3 gap-x-[71px]">
      <div className="col-span-1 space-y-5">
        <div className="flex items-center space-x-4">
          <FilterDateRange
            // startDate={decodeURIComponent(searchParams?.startDate as string)}
            // endDate={decodeURIComponent(searchParams?.endDate as string)}
            startDate="12/4/2023"
            endDate="12/4/2023"
          />
          <button className="flex max-w-80 items-center gap-2 rounded-lg border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600">
            <span>Filter</span>
          </button>
        </div>
        <PipelineCardContainer />
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-x-[71px] gap-y-10">
        <div className="flex max-h-96 min-w-[500px] items-center justify-center rounded-lg border border-gray-300 bg-white p-3">
          <PipelineBarChart
            height={300}
            title="Total Leads Generated per Month"
          />
        </div>
        <div className="flex max-h-96 min-w-[500px] items-center justify-center rounded-lg border border-gray-300 bg-white p-3">
          <PipelineBarChart
            height={300}
            title="Total Leads Generated per Month"
          />
        </div>
        <div className="flex max-h-96 min-w-[500px] items-center justify-center rounded-lg border border-gray-300 bg-white p-3">
          <PipelineBarChart
            height={300}
            title="Total Leads Generated per Month"
          />
        </div>
        <div className="flex max-h-96 min-w-[500px] items-center justify-center rounded-lg border border-gray-300 bg-white p-3">
          <PipelineBarChart
            height={300}
            title="Total Leads Generated per Month"
          />
        </div>
      </div>
    </div>
  );
}
