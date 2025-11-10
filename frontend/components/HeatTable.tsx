/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lane, GetLanesData } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GET_LANES } from "@/app/api/graphql/queries/laneQueries";
import { SAVE_HEAT_RESULTS } from "@/app/api/graphql/mutations/heatMutations";
import { GET_HEAT_RESULTS } from "@/app/api/graphql/queries/heatQueries";
import { getRowColor } from "@/lib/tableUtils";
import { getLeaderTime, getRank, getDelta } from "@/lib/swimUtils";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";

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
  const [lanes, setLanes] = useState<Lane[]>([]);
  const { elapsed, setElapsed, rafRef } = useStopwatch(
    isHeatActive,
    startTimestamp
  );

  const { data, loading, error, startPolling, stopPolling } =
    useQuery<GetLanesData>(GET_LANES, {
      variables: { heatId },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  const [saveHeatResults] = useMutation(SAVE_HEAT_RESULTS, {
    refetchQueries: [
      {
        query: GET_HEAT_RESULTS,
        variables: { heatId },
      },
    ],
  });

  // sync lanes
  useEffect(() => {
    if (data?.lanes) setLanes(data.lanes);
  }, [data]);

  // control polling
  useEffect(() => {
    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");

    if (isHeatActive && !allFinished) {
      console.log("Starting polling...");
      startPolling(1200);
    } else {
      console.log("Stopping polling...");
      stopPolling();
    }
  }, [isHeatActive, lanes, startPolling, stopPolling]);

  // stop stopwatch, stop polling and save results once all lanes are finished
  useEffect(() => {
    if (!isHeatActive) return;

    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");

    if (allFinished && rafRef.current) {
      console.log("heat done, stopping stopwatch and polling");

      // Stop animation loop
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      // Reset elapsed time
      setElapsed(0);

      // Stop polling
      stopPolling();

      // Save results
      saveHeatResults({ variables: { heatId } })
        .then(() => console.log("heat results saved"))
        .catch((err) => console.error("Save failed: ", err));
    }
  }, [
    lanes,
    isHeatActive,
    stopPolling,
    saveHeatResults,
    heatId,
    rafRef,
    setElapsed,
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
        return <Badge className="bg-sport-official text-white">Official</Badge>;
      case "ONGOING":
        return <Badge className="bg-sport-ongoing text-white">Pågående</Badge>;
      case "FINISHED":
        return <Badge variant="secondary">Klar</Badge>;
      case "WAITING":
        return <Badge variant="outline">Väntar</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with stopwatch */}
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

      {/* Desktop Table */}
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
