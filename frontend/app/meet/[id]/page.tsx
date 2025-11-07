"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { SessionSidebar } from "@/components/SessionSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { GET_MEET_BY_ID } from "@/app/api/graphql/queries/meetQueries";
import { GET_EVENTS_BY_MEET } from "@/app/api/graphql/queries/eventQueries";
import { GET_SESSIONS_BY_MEET } from "@/app/api/graphql/queries/sessionQueries";
import { GET_HEATS_BY_MEET } from "@/app/api/graphql/queries/heatQueries";
import {
  GetSessionsData,
  GetEventsData,
  GetMeetsByIdData,
  Heat,
  GetHeatsData,
} from "@/types/swim";
import { useQuery } from "@apollo/client/react";

const MeetDetails = () => {
  const params = useParams();
  const meetId = params.id as string;

  const {
    data: meetData,
    loading: meetLoading,
    error: meetError,
  } = useQuery<GetMeetsByIdData>(GET_MEET_BY_ID, {
    variables: { id: meetId },
  });

  const {
    data: sessionData,
    loading: sessionLoading,
    error: sessionError,
  } = useQuery<GetSessionsData>(GET_SESSIONS_BY_MEET, {
    variables: { meetId },
  });

  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery<GetEventsData>(GET_EVENTS_BY_MEET, {
    variables: { meetId },
  });

  const {
    data: heatData,
    loading: heatLoading,
    error: heatError,
  } = useQuery<GetHeatsData>(GET_HEATS_BY_MEET, { variables: { meetId } });

  const meet = meetData?.meet;
  const sessions = useMemo(() => sessionData?.sessions ?? [], [sessionData]);
  // Memoize events so the reference doesn't change unnecessarily
  const events = useMemo(() => eventData?.events ?? [], [eventData]);
  const allHeats = heatData?.heats ?? [];

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  // Filter events for active session
  const eventsForSession = useMemo(
    () =>
      events.filter(
        (e) => e.meetId === meetId && e.sessionId === activeSessionId
      ),
    [meetId, activeSessionId, events]
  );

  if (meetLoading || sessionLoading || eventLoading || heatLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Laddar tävling...</p>
      </div>
    );

  if (meetError || sessionError || eventError || heatError)
    return (
      <p className="text-destructive">
        Fel vid hämtning av data:{" "}
        {meetError?.message ||
          sessionError?.message ||
          eventError?.message ||
          heatError?.message}
      </p>
    );

  if (!meet) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Tävling hittades inte
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Banner */}
      <div className="w-full h-48 sm:h-64 overflow-hidden bg-muted">
        <Image
          src={meet.bannerUrl}
          alt={`${meet.name} banner`}
          className="w-full h-full object-cover"
          width={1000}
          height={1000}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {meet.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(meet.startDate)} - {formatDate(meet.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{meet.location}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="events" className="mb-6">
          <TabsList>
            <TabsTrigger value="events">Evenemang</TabsTrigger>
            <TabsTrigger value="swimmers">Simmare</TabsTrigger>
            <TabsTrigger value="files">Filer</TabsTrigger>
            <TabsTrigger value="scoreboard">Resultattavla</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sessions Sidebar */}
              <div className="lg:w-64 shrink-0">
                <div className="lg:sticky lg:top-20">
                  <SessionSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSessionClick={setActiveSessionId}
                  />
                </div>
              </div>

              {/* Events List */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Evenemang
                </h2>
                {eventsForSession.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Inga evenemang för vald session
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {eventsForSession.map((event) => {
                      const heats = allHeats.filter(
                        (h) => h.eventId === event.id
                      );
                      return (
                        <Card
                          key={event.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {event.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="secondary">
                                    {event.distance}m
                                  </Badge>
                                  <Badge variant="secondary">
                                    {event.stroke}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {event.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {heats.length} heat
                                {heats.length !== 1 ? "s" : ""}
                              </p>
                              {heats.map((heat: Heat) => (
                                <Link
                                  key={heat.id}
                                  href={`/heat/${heat.id}`}
                                  className="block"
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                  >
                                    <span>
                                      Heat {heat.number} -{" "}
                                      {formatTime(heat.startTime)}
                                    </span>
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swimmers">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Simmarlista kommer snart...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Filer kommer snart...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoreboard">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Resultattavla kommer snart...
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MeetDetails;
