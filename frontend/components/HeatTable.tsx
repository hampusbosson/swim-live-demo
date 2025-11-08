"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lane, getLanesData } from "@/types/swim";
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
import { motion } from "framer-motion";

interface HeatTableProps {
  heatId: string;
  heatNumber?: number;
  isHeatActive?: boolean;
}

export const HeatTable = ({
  heatId,
  heatNumber,
  isHeatActive,
}: HeatTableProps) => {
  const { data, loading, error, startPolling, stopPolling, refetch } =
    useQuery<getLanesData>(GET_LANES, {
      variables: { heatId },
      pollInterval: isHeatActive ? 300 : 0, // conditional polling
      notifyOnNetworkStatusChange: true,
    });

  const [lanes, setLanes] = useState<Lane[]>([]);

  useEffect(() => {
    if (isHeatActive) {
      refetch().then(() => startPolling(300));
    } else {
      stopPolling();
      refetch();
    }
  }, [isHeatActive, startPolling, stopPolling, refetch]);

  useEffect(() => {
    if (data?.lanes) {
      const newLanes = data.lanes;
      setLanes(newLanes);
    }
  }, [data, lanes]);

  if (loading && lanes.length === 0)
    return <p className="text-center text-muted-foreground">Laddar banor...</p>;
  if (error)
    return <p className="text-center text-destructive">Fel: {error.message}</p>;

  const sortedLanes = [...lanes].sort((a, b) => a.lane - b.lane);

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
      {heatNumber && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Heat {heatNumber}
          </h2>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-16">Bana</TableHead>
                <TableHead>Simmare</TableHead>
                <TableHead>Klubb</TableHead>
                <TableHead className="w-16">År</TableHead>
                <TableHead className="w-24">Seed</TableHead>
                <TableHead className="w-24">Resultat</TableHead>
                <TableHead className="w-28">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLanes.map((lane) => (
                <motion.tr
                  key={lane.id}
                  layout
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "transition-colors",
                    lane.status === "ONGOING" && "bg-sport-ongoing/10",
                    lane.status === "OFFICIAL" && "bg-sport-official/5"
                  )}
                >
                  <TableCell className="font-bold text-center">
                    {lane.lane}
                  </TableCell>
                  <TableCell className="font-medium">{lane.swimmer}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lane.club}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {lane.year}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {lane.seedTime}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {lane.resultTime || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(lane.status)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
