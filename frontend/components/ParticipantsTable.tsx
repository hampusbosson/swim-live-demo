"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client/react";
import { GET_LANES } from "@/app/api/graphql/queries/laneQueries";
import { GetLanesData } from "@/types/swim";

interface ParticipantsTableProps {
  heatId: string;
  heatNumber?: number;
}

export const ParticipantsTable = ({
  heatId,
  heatNumber,
}: ParticipantsTableProps) => {
  const { data, loading, error } = useQuery<GetLanesData>(GET_LANES, {
    variables: { heatId },
  });

  if (loading)
    return (
      <p className="text-center text-muted-foreground">Laddar deltagare...</p>
    );

  if (error)
    return <p className="text-center text-destructive">Fel: {error.message}</p>;

  const lanes = [...(data?.lanes || [])].sort((a, b) => a.lane - b.lane);

  return (
    <div className="space-y-4">
      {heatNumber && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">
            Deltagare — Heat {heatNumber}
          </h2>
          <Badge variant="outline" className="text-xs">
            Startlista
          </Badge>
        </div>
      )}

      <div className="hidden md:block">
        <Card className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-center w-12">Bana</TableHead>
                <TableHead>Namn</TableHead>
                <TableHead>Klubb</TableHead>
                <TableHead className="text-center w-16">År</TableHead>
                <TableHead className="text-center w-20">Seed</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lanes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground italic"
                  >
                    Inga deltagare hittades för detta heat.
                  </TableCell>
                </TableRow>
              ) : (
                lanes.map((lane) => (
                  <motion.tr
                    key={lane.id}
                    layout
                    transition={{ duration: 0.3 }}
                    className={cn("transition-colors hover:bg-muted/40")}
                  >
                    <TableCell className="text-center font-semibold">
                      {lane.lane}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[140px]">
                      {lane.swimmer}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[140px]">
                      {lane.club}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {lane.year}
                    </TableCell>
                    <TableCell className="text-center font-mono font-semibold">
                      {lane.seedTime}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
