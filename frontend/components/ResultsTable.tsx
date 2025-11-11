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
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useQuery } from "@apollo/client/react";
import { GET_HEAT_RESULTS } from "@/app/api/graphql/queries/heatQueries";
import { getRowColor } from "@/lib/tableUtils";
import { GetHeatResultsData } from "@/types";

interface ResultTableProps {
  heatId: string;
  heatNumber?: number;
}

export const ResultTable = ({ heatId, heatNumber }: ResultTableProps) => {
  const { data, loading, error } = useQuery<GetHeatResultsData>(
    GET_HEAT_RESULTS,
    {
      variables: { heatId },
      fetchPolicy: "network-only",
    }
  );

  //handle loading and errors
  if (loading) return <LoadingState text="Laddar resultat..." />;
  if (error) return <ErrorState message={error.message} />;

  // transform and sort heat results
  const results = [...(data?.heatResults || [])].sort((a, b) => a.rank - b.rank);

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
              {results.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground italic"
                  >
                    Inget resultat finns tillgängligt ännu. <br />
                    Starta en simulering för att visa resultat.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((r) => (
                  <motion.tr
                    key={r.lane}
                    layout
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "transition-colors hover:bg-muted/40",
                      getRowColor(r.rank)
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
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};