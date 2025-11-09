"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { TopNav } from "@/components/TopNav";
import { EventHeader } from "@/components/EventHeader";
import { HeatTable } from "@/components/HeatTable";
import { ResultTable } from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GET_EVENT_BY_HEAT } from "@/app/api/graphql/queries/eventQueries";
import { GET_MEET_BY_ID } from "@/app/api/graphql/queries/meetQueries";
import { GET_HEAT_BY_ID } from "@/app/api/graphql/queries/heatQueries";
import {
  START_HEAT,
  RESET_HEAT,
} from "@/app/api/graphql/mutations/heatMutations";
import {
  GetEventByHeatData,
  GetMeetByIdData,
  GetHeatByIdData,
} from "@/types/swim";
import { useState } from "react";

const HeatView = () => {
  const params = useParams();
  const meetId = params.id as string;
  const heatId = params.heatId as string;

  const [activeTab, setActiveTab] = useState("heats");
  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [isHeatActive, setIsHeatActive] = useState<boolean>();

  //Meet info
  const {
    data: meetData,
    loading: meetLoading,
    error: meetError,
  } = useQuery<GetMeetByIdData>(GET_MEET_BY_ID, {
    variables: { id: meetId },
  });

  // Event info (linked to this heat)
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery<GetEventByHeatData>(GET_EVENT_BY_HEAT, {
    variables: { heatId },
  });

  // heat info
  const {
    data: heatData,
    refetch: refetchHeat,
    loading: heatLoading,
    error: heatError,
  } = useQuery<GetHeatByIdData>(GET_HEAT_BY_ID, {
    variables: { id: heatId },
    fetchPolicy: "network-only",
  });

  // Mutations for start/reset simulation
  const [startHeat, { loading: starting }] = useMutation(START_HEAT, {
    variables: { heatId },
  });

  const [resetHeat, { loading: resetting }] = useMutation(RESET_HEAT, {
    variables: { heatId },
  });

  const handleStartHeat = async () => {
    setIsHeatActive(true);
    await startHeat();
    await refetchHeat();
    console.log(heatStartTimestamp);
  };

  const handleResetHeat = async () => {
    setIsHeatActive(false);
    await resetHeat();
    await refetchHeat();
  };

  //Handle loading/errors
  if (meetLoading || eventLoading || heatLoading)
    return <p className="text-center text-muted-foreground">Laddar heat...</p>;

  if (meetError || eventError || heatError)
    return (
      <p className="text-center text-destructive">
        Fel: {meetError?.message || eventError?.message || heatError?.message}
      </p>
    );

  const meet = meetData?.meet;
  const event = eventData?.eventByHeat ?? null;
  const heatNumber = heatData?.heat?.number;
  const heatStartTimestamp = heatData?.heat?.startTimestamp ?? null;

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
        <EventHeader
          event={event}
          bannerUrl={meet?.bannerUrl}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        {/* --- Simulation Controls --- */}
        <div className="flex gap-2">
          <Button onClick={handleStartHeat} disabled={starting}>
            <Play className="mr-2 h-4 w-4" /> Starta simulering
          </Button>
          <Button
            variant="secondary"
            onClick={handleResetHeat}
            disabled={resetting}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Återställ
          </Button>
        </div>

        {activeTab === "heats" && (
          <HeatTable
            heatId={heatId}
            heatNumber={1}
            isHeatActive={isHeatActive}
            startTimestamp={heatStartTimestamp}
          />
        )}

        {activeTab === "results" && (
          <ResultTable heatId={heatId} heatNumber={heatNumber}/>
        )}
      </main>
    </div>
  );
};

export default HeatView;
