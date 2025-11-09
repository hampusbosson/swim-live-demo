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
import { GET_HEAT_RESULTS } from "@/app/api/graphql/queries/heatQueries";

interface Result {
  heatId: string;
  swimmer: string;
  club: string;
  lane: number;
  resultTime: string;
  rank: number;
}

interface GetHeatResultsData {
  heatResults: Result[];
}

interface ResultTableProps {
  heatId: string;
  heatNumber?: number;
}

export const ResultTable = ({ heatId, heatNumber }: ResultTableProps) => {

  const { data, loading, error } = useQuery<GetHeatResultsData>(
    GET_HEAT_RESULTS,
    { variables: { heatId } }
  );

  if (loading)
    return <p className="text-center text-muted-foreground">Laddar resultat...</p>;
  if (error)
    return (
      <p className="text-center text-destructive">Fel: {error.message}</p>
    );

  const results = [...(data?.heatResults || [])].sort(
    (a, b) => a.rank - b.rank
  );

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

  return (
    <div className="space-y-4">
      {heatNumber && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">
            Resultat — Heat {heatNumber}
          </h2>
          <Badge variant="outline" className="text-xs">
            Heat Sammanfattning
          </Badge>
        </div>
      )}

      <div className="hidden md:block">
        <Card className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-center w-12">Plac</TableHead>
                <TableHead className="text-center w-12">Bana</TableHead>
                <TableHead>Namn</TableHead>
                <TableHead>Klubb</TableHead>
                <TableHead className="text-center w-24">Tid</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {results.map((r) => (
                <motion.tr
                  key={r.lane}
                  layout
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "transition-colors",
                    getRowColor(r.rank),
                    "hover:bg-muted/40"
                  )}
                >
                  <TableCell className="text-center font-semibold">
                    {r.rank}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {r.lane}
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[140px]">
                    {r.swimmer}
                  </TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[140px]">
                    {r.club}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {r.resultTime}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};