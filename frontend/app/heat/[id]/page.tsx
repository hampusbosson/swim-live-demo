"use client"

import { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { EventHeader } from "@/components/EventHeader";
import { HeatTable } from "@/components/HeatTable";
import {
  mockHeats,
  mockEvents,
  mockLanes,
  mockMeets,
  Lane,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
//import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useParams } from "next/navigation";

const HeatView = () => {
    const params = useParams();
  const heatId = params.id as string; 

  //const { toast } = useToast();
  const [lanes, setLanes] = useState<Lane[]>([]);

  const heat = mockHeats.find((h) => h.id === heatId);
  const event = heat ? mockEvents.find((e) => e.id === heat.eventId) : undefined;
  const meet = event ? mockMeets.find((m) => m.id === event.meetId) : undefined;

  useEffect(() => {
    // Initialize lanes
    const initialLanes = mockLanes.filter((l) => l.heatId === heatId);
    setLanes(initialLanes);
  }, [heatId]);


  {/**
  useEffect(() => {
    // Simulate live result updates
    const interval = setInterval(() => {
      setLanes((currentLanes) => {
        // Find lanes that are waiting or ongoing
        const updatableLanes = currentLanes.filter(
          (l) => l.status === "WAITING" || l.status === "ONGOING"
        );

        if (updatableLanes.length === 0) {
          return currentLanes;
        }

        // Randomly pick one lane to update
        const randomIndex = Math.floor(Math.random() * updatableLanes.length);
        const laneToUpdate = updatableLanes[randomIndex];

        // Update the lane
        return currentLanes.map((lane) => {
          if (lane.id === laneToUpdate.id) {
            // If waiting, mark as ongoing
            if (lane.status === "WAITING") {
              return { ...lane, status: "ONGOING" as const };
            }
            // If ongoing, add result time and mark as finished
            if (lane.status === "ONGOING") {
              const seedSeconds = parseFloat(lane.seedTime);
              const variance = (Math.random() - 0.3) * 1.5; // Random between -0.45 and 1.05
              const resultSeconds = Math.max(seedSeconds + variance, seedSeconds - 0.5);
              const resultTime = resultSeconds.toFixed(2);

              // Show toast notification
              toast({
                title: "Resultat uppdaterat",
                description: `${lane.swimmer} - Bana ${lane.lane}: ${resultTime}s`,
              });

              return {
                ...lane,
                resultTime,
                status: "FINISHED" as const,
              };
            }
          }
          return lane;
        });
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [toast]);

  */}

  if (!heat || !event || !meet) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Heat hittades inte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href={`/meet/${meet.id}`}>
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Tillbaka till {meet.name}
          </Button>
        </Link>

        {/* Event Header */}
        <div className="mb-6">
          <EventHeader event={event} bannerUrl={meet.bannerUrl} />
        </div>

        {/* Heat Table */}
        <HeatTable lanes={lanes} heatNumber={heat.number} />
      </main>
    </div>
  );
};

export default HeatView;