"use client";

import { HeatTable } from "@/components/HeatTable";
import { ResultTable } from "@/components/ResultsTable";
import { ParticipantsTable } from "@/components/ParticipantsTable";

interface HeatContentProps {
  activeTab: string;
  heatId: string;
  heatNumber?: number;
  isHeatActive: boolean;
  startTimestamp?: number | null;
}

export const HeatContent = ({
  activeTab,
  heatId,
  heatNumber,
  isHeatActive,
  startTimestamp,
}: HeatContentProps) => {
  switch (activeTab) {
    case "results":
      return <ResultTable heatId={heatId} heatNumber={heatNumber} />;
    case "participants":
      return <ParticipantsTable heatId={heatId} />;
    default:
      return (
        <HeatTable
          heatId={heatId}
          heatNumber={heatNumber}
          isHeatActive={isHeatActive}
          startTimestamp={startTimestamp}
        />
      );
  }
};