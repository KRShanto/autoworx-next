import PipelineReportCard from "./PipelineReportCard";
import { TiArrowSortedUp } from "react-icons/ti";
export default function PipelineCardContainer() {
  return (
    <div className="space-y-2">
      <PipelineReportCard
        title="Average Deal Size"
        averageValue="$ 45"
        icon={<TiArrowSortedUp />}
        tradeValue="4%"
      />
      <PipelineReportCard
        title="Average Sales Cycle Length"
        averageValue="45 hours"
        icon={<TiArrowSortedUp />}
        tradeValue="4%"
      />
      <PipelineReportCard
        title="Win/Loss Rate"
        averageValue="45%"
        icon={<TiArrowSortedUp />}
        tradeValue="4%"
      />
      <PipelineReportCard
        title="Average Sales Cycle Length"
        averageValue="45 hours"
        icon={<TiArrowSortedUp />}
        tradeValue="4%"
      />
      <PipelineReportCard
        title="Win/Loss Rate"
        averageValue="45%"
        icon={<TiArrowSortedUp />}
        tradeValue="4%"
      />
    </div>
  );
}
