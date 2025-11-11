"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useHeatLanes } from "@/hooks/useHeatLanes";
import { useStopwatch } from "@/hooks/useStopwatch";
import { getRowColor } from "@/lib/tableUtils";
import { getLeaderTime, getRank, getDelta } from "@/lib/swimUtils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client/react";
import { FINISH_HEAT } from "@/app/api/graphql/mutations/heatMutations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lane } from "@/types";
import Error from "next/error";

interface HeatTableProps {
  heatId: string;
  heatNumber?: number;
  isHeatActive?: boolean;
  startTimestamp?: number | null;
}

export const HeatTable = ({
  heatId,
  heatNumber,
  isHeatActive,
  startTimestamp,
}: HeatTableProps) => {
  const { lanes, loading, error, stopPolling } = useHeatLanes(
    heatId,
    isHeatActive
  );

  const { elapsed, setElapsed, rafRef } = useStopwatch(
    isHeatActive,
    startTimestamp
  );

  const [finishHeatMutation] = useMutation(FINISH_HEAT);

  // stop stopwatch + save results once finished
  useEffect(() => {
    if (!isHeatActive) return;

    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");

    if (allFinished && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setElapsed(0);
      stopPolling();

      // Build the results payload to send to backend
      const results = lanes
        .filter((l) => l.resultTime)
        .map((l) => ({
          lane: l.lane,
          swimmer: l.swimmer,
          club: l.club,
          resultTime: l.resultTime!,
        }));

      // Send final results to backend
      finishHeatMutation({
        variables: { heatId, results },
        refetchQueries: ["GetHeatResults"], 
      })
        .then(() => {
          console.log(`Heat ${heatId} results saved`);
        })
        .catch((err: Error) => {
          console.error("Error saving results:", err);
        });
    }
  }, [
    lanes,
    isHeatActive,
    rafRef,
    setElapsed,
    stopPolling,
    finishHeatMutation,
    heatId,
  ]);

  if (loading && lanes.length === 0)
    return <p className="text-center text-muted-foreground">Laddar banor...</p>;
  if (error)
    return <p className="text-center text-destructive">Fel: {error.message}</p>;

  const sortedLanes = [...lanes].sort((a, b) => a.lane - b.lane);
  const finished = sortedLanes.filter((l) => l.resultTime);
  const leaderTime = getLeaderTime(sortedLanes);

  const getStatusBadge = (status: Lane["status"]) => {
    switch (status) {
      case "OFFICIAL":
        return <Badge variant="outline">Official</Badge>;
      case "ONGOING":
        return <Badge variant="outline">Pågående</Badge>;
      case "FINISHED":
        return <Badge variant="secondary">Klar</Badge>;
      case "WAITING":
        return <Badge variant="outline">Väntar</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {heatNumber && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">
            Heat {heatNumber}
          </h2>
          {isHeatActive && (
            <span className="font-mono text-lg text-sport-ongoing">
              🕒 {elapsed.toFixed(2)}s
            </span>
          )}
        </div>
      )}

      <div className="hidden md:block">
        <Card className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-center w-12">Bana</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Klubb</TableHead>
                <TableHead className="text-center w-16">År</TableHead>
                <TableHead className="text-center w-16">Seed</TableHead>
                <TableHead className="text-center w-16">Heat Rk</TableHead>
                <TableHead className="text-center w-16">Tid</TableHead>
                <TableHead className="text-center w-16">Δ</TableHead>
                <TableHead className="text-center w-28">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedLanes.map((lane) => {
                const rank = getRank(lane, finished);
                const delta = getDelta(lane, leaderTime);
                const rowStyle =
                  lane.status === "FINISHED" && typeof rank === "number"
                    ? getRowColor(rank)
                    : "";

                return (
                  <motion.tr
                    key={lane.id}
                    layout
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "transition-colors",
                      rowStyle,
                      lane.status === "ONGOING" && "bg-sport-ongoing/10"
                    )}
                  >
                    <TableCell className="text-center font-semibold">
                      {lane.lane}
                    </TableCell>
                    <TableCell className="font-medium">
                      {lane.swimmer}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lane.club}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {lane.year}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {lane.seedTime}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {rank}
                    </TableCell>
                    <TableCell className="text-center font-mono font-semibold">
                      {lane.status === "ONGOING"
                        ? elapsed.toFixed(2)
                        : lane.resultTime || "-"}
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {delta}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(lane.status)}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
