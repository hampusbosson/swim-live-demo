"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lane, GetLanesData } from "@/types/swim";
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
  const { data, loading, error, startPolling, stopPolling} =
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

  const [lanes, setLanes] = useState<Lane[]>([]);
  const [elapsed, setElapsed] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

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

  // stopwatch
  useEffect(() => {
    if (!isHeatActive || !startTimestamp) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setElapsed(0);
      return;
    }

    const tick = () => {
      setElapsed((Date.now() - startTimestamp) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHeatActive, startTimestamp]);

  // stop stopwatch,stop polling and save results once all lanes are finished
  useEffect(() => {
    if (!isHeatActive) return;
    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");
    if (allFinished && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      stopPolling();
      saveHeatResults({ variables: { heatId } })
        .then(() => console.log("Heat results saved"))
        .catch((err) => console.error("Save failed: ", err));
    }
  }, [lanes, isHeatActive, stopPolling, saveHeatResults, heatId]);

  if (loading && lanes.length === 0)
    return <p className="text-center text-muted-foreground">Laddar banor...</p>;
  if (error)
    return <p className="text-center text-destructive">Fel: {error.message}</p>;

  const sortedLanes = [...lanes].sort((a, b) => a.lane - b.lane);
  const finished = sortedLanes.filter((l) => l.resultTime);
  const leader =
    finished.length > 0
      ? Math.min(...finished.map((l) => parseFloat(l.resultTime!)))
      : null;

  const getRank = (lane: Lane) => {
    if (!lane.resultTime) return "-";
    const ranked = [...finished].sort(
      (a, b) => parseFloat(a.resultTime!) - parseFloat(b.resultTime!)
    );
    return ranked.findIndex((l) => l.id === lane.id) + 1 || "-";
  };

  const getDelta = (lane: Lane) => {
    if (!leader || !lane.resultTime) return "-";
    const delta = parseFloat(lane.resultTime) - leader;
    return delta <= 0 ? "-" : `+${delta.toFixed(2)}`;
  };

  const getRowColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-300/50 border-l-4 border-yellow-500"; // Gold
      case 2:
        return "bg-gray-300/50 border-l-4 border-gray-500"; // Silver
      case 3:
        return "bg-amber-600/30 border-l-4 border-amber-700"; // Bronze
      default:
        return "";
    }
  };

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
                const rank = getRank(lane);
                const delta = getDelta(lane);
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
