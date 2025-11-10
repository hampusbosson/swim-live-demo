/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { useMeetData } from "@/hooks/useMeetData";
import { MeetHeader } from "@/components/MeetHeader";
import { MeetTabs } from "@/components/MeetTabs";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const MeetDetails = () => {
  const params = useParams();
  const meetId = params.id as string;

  const { meet, sessions, events, heats, loading, error } = useMeetData(meetId);

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  if (loading) return <LoadingState text="Laddar tävling..." fullScreen />;
  if (error) return <ErrorState message={error.message} fullScreen />;
  if (!meet) return <ErrorState message="Tävling hittades inte." fullScreen />;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <MeetHeader meet={meet} />
      <div className="container mx-auto px-4 py-6">
        <MeetTabs
          meetId={meetId}
          sessions={sessions}
          events={events}
          heats={heats}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
        />
      </div>
    </div>
  );
};

export default MeetDetails;
