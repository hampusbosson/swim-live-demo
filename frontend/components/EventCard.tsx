"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/timeUtils";
import type { Event, Heat } from "@/types";

interface EventCardProps {
  meetId: string;
  event: Event;
  heats: Heat[];
}

export const EventCard = ({ meetId, event, heats }: EventCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">
            {event.name}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{event.distance}m</Badge>
            <Badge variant="secondary">{event.stroke}</Badge>
            <Badge variant="secondary">{event.category}</Badge>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {heats.length} heat{heats.length !== 1 ? "s" : ""}
        </p>
        {heats.map((heat) => (
          <Link key={heat.id} href={`/meet/${meetId}/heat/${heat.id}`}>
            <Button variant="outline" className="w-full justify-between mb-2">
              <span>
                Heat {heat.number} - {formatTime(heat.startTime)}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
);