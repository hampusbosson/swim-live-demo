"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { TopNav } from "@/components/TopNav";
import { EventHeader } from "@/components/EventHeader";
import { HeatTable } from "@/components/HeatTable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GET_EVENT_BY_HEAT } from "@/app/api/graphql/queries/eventQueries";
import { GET_MEET_BY_ID } from "@/app/api/graphql/queries/meetQueries";
import {
  START_HEAT,
  RESET_HEAT,
} from "@/app/api/graphql/mutations/heatMutations";
import {
  getEventByHeatData,
  GetMeetByIdData,
} from "@/types/swim";

const HeatView = () => {
  const params = useParams();
  const meetId = params.id as string;
  const heatId = params.heatId as string;

  // --- Meet info ---
  const {
    data: meetData,
    loading: meetLoading,
    error: meetError,
  } = useQuery<GetMeetByIdData>(GET_MEET_BY_ID, {
    variables: { id: meetId },
  });

  // --- Event info (linked to this heat) ---
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery<getEventByHeatData>(GET_EVENT_BY_HEAT, {
    variables: { heatId },
  });

  // --- Mutations for start/reset simulation ---
  const [startHeat, { loading: starting }] = useMutation(START_HEAT, {
    variables: { heatId },
  });

  const [resetHeat, { loading: resetting }] = useMutation(RESET_HEAT, {
    variables: { heatId },
  });

  // --- Handle loading/errors ---
  if (meetLoading || eventLoading)
    return <p className="text-center text-muted-foreground">Laddar heat...</p>;

  if (meetError || eventError)
    return (
      <p className="text-center text-destructive">
        Fel: {meetError?.message || eventError?.message}
      </p>
    );

  const meet = meetData?.meet;
  const event = eventData?.eventByHeat;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* --- Back Button --- */}
        <Link href={`/meet/${meetId}`}>
          <Button variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Tillbaka till tävling
          </Button>
        </Link>

        {/* --- Event Header --- */}
        <EventHeader event={event} bannerUrl={meet?.bannerUrl} />

        {/* --- Simulation Controls --- */}
        <div className="flex gap-2">
          <Button onClick={() => startHeat()} disabled={starting}>
            <Play className="mr-2 h-4 w-4" /> Starta simulering
          </Button>
          <Button
            variant="secondary"
            onClick={() => resetHeat()}
            disabled={resetting}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Återställ
          </Button>
        </div>

        {/* --- Heat Table (self-polling) --- */}
        <HeatTable heatId={heatId} heatNumber={1} />
      </main>
    </div>
  );
};

export default HeatView;