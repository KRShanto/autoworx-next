import FilterDateRange from "../../components/filter/FilterByDateRange";
import PipelineCardContainer from "./PipelineCardContainer";
import LeadsBarChartContainer from "./chart/LeadsBarChartContainer";
import EstimateBarChartContainer from "./chart/EstimateBarChartContainer";
import InvoicesBarChartContainer from "./chart/InvoicesBarChartContainer";
import SalesActivityChartContainer from "./chart/SalesActivityChartContainer";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import FilterHeader from "./FilterHeader";

type TProps = {
  searchParams: {
    startDate?: string;
    endDate?: string;
  };
};

type TSliderData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit";
};
const filterMultipleSliders: TSliderData[] = [
  {
    id: 1,
    type: "price",
    min: 0,
    max: 300,
    // defaultValue: [50, 250],
  },
  {
    id: 2,
    type: "cost",
    min: 0,
    max: 400,
    // defaultValue: [100, 300],
  },
  {
    id: 3,
    type: "profit",
    min: 0,
    max: 500,
  },
];

export default function PipelinePage({ searchParams }: TProps) {
  return (
    <div className="grid grid-cols-3 gap-x-6">
      <div className="col-span-1 space-y-5">
        <FilterHeader
          searchParams={searchParams}
          filterMultipleSliders={filterMultipleSliders}
        />
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
