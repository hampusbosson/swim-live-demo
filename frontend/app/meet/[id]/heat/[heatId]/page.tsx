"use client";

import { TopNav } from "@/components/TopNav";
import { EventHeader } from "@/components/EventHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEventData } from "@/hooks/useEventData";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { HeatControls } from "@/components/HeatControls";
import { HeatContent } from "@/components/HeatContent";

const HeatView = () => {
  const params = useParams();
  const meetId = params.id as string;
  const heatId = params.heatId as string;

  const [activeTab, setActiveTab] = useState("heats");
  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [isHeatActive, setIsHeatActive] = useState<boolean>(false);

  const { meet, event, heat, loading, error, refetchHeat } = useEventData(
    meetId,
    heatId
  );

  //Handle loading/errors
  if (loading) return <LoadingState fullScreen text="Laddar heat..." />;
  if (error)
    return (
      <ErrorState
        message={
          error.message || "Ett fel inträffade vid hämtning av heatdata."
        }
        fullScreen
      />
    );

  const handleStartHeat = async () => {
    await refetchHeat(); 
    setIsHeatActive(true); 
  };

  const handleResetHeat = async () => {
    await refetchHeat(); 
    setIsHeatActive(false); 
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-4">
        <Link href={`/meet/${meetId}`}>
          <Button variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Tillbaka till tävling
          </Button>
        </Link>

        <EventHeader
          event={event}
          bannerUrl={meet?.bannerUrl}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        <HeatControls
          heatId={heatId}
          onStart={handleStartHeat}
          onReset={handleResetHeat}
        />

        <HeatContent
          activeTab={activeTab}
          heatId={heatId}
          heatNumber={heat?.number}
          isHeatActive={isHeatActive}
          startTimestamp={heat?.startTimestamp}
        />
      </main>
    </div>
  );
};

export default HeatView;
