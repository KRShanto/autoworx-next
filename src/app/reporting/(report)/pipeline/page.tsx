import FilterDateRange from "../../components/filter/FilterByDateRange";
import PipelineCardContainer from "../../components/pipeline/PipelineCardContainer";
import LeadsBarChartContainer from "../../components/pipeline/chart/LeadsBarChartContainer";
import EstimateBarChartContainer from "../../components/pipeline/chart/EstimateBarChartContainer";
import InvoicesBarChartContainer from "../../components/pipeline/chart/InvoicesBarChartContainer";
import SalesActivityChartContainer from "../../components/pipeline/chart/SalesActivityChartContainer";
export default function PipelinePage() {
  return (
    <div className="grid grid-cols-3 gap-x-6">
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
      <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-10">
        <LeadsBarChartContainer />
        <EstimateBarChartContainer />
        <InvoicesBarChartContainer />
        <SalesActivityChartContainer />
      </div>
    </div>
  );
}
