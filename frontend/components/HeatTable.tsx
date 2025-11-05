import { Lane } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
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

interface HeatTableProps {
  lanes: Lane[];
  heatNumber?: number;
}

export const HeatTable = ({ lanes, heatNumber }: HeatTableProps) => {
  const getStatusBadge = (status: Lane["status"]) => {
    switch (status) {
      case "OFFICIAL":
        return (
          <Badge className="bg-sport-official text-white">
            Official
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge className="bg-sport-ongoing text-white">
            Pågående
          </Badge>
        );
      case "FINISHED":
        return <Badge variant="secondary">Klar</Badge>;
      case "WAITING":
        return <Badge variant="outline">Väntar</Badge>;
    }
  };

  const sortedLanes = [...lanes].sort((a, b) => a.lane - b.lane);

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
                <TableRow
                  key={lane.id}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedLanes.map((lane) => (
          <Card
            key={lane.id}
            className={cn(
              "p-4 transition-colors",
              lane.status === "ONGOING" && "bg-sport-ongoing/10 border-sport-ongoing",
              lane.status === "OFFICIAL" && "bg-sport-official/5 border-sport-official"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                  {lane.lane}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{lane.swimmer}</p>
                  <p className="text-sm text-muted-foreground">{lane.club}</p>
                </div>
              </div>
              {getStatusBadge(lane.status)}
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">År</p>
                <p className="font-medium">{lane.year}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Seed</p>
                <p className="font-mono font-medium">{lane.seedTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Resultat</p>
                <p className="font-mono font-semibold">
                  {lane.resultTime || "-"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
