"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsSection } from "@/components/EventsSection";
import { Event, Heat, Session } from "@/types";
import { EmptyState } from "./ui/empty-state";

interface MeetTabsProps {
  meetId: string;
  sessions: Session[];
  events: Event[];
  heats: Heat[];
  activeSessionId?: string;
  setActiveSessionId: (id: string) => void;
}

export const MeetTabs = ({
  meetId,
  sessions,
  events,
  heats,
  activeSessionId,
  setActiveSessionId,
}: MeetTabsProps) => {
  return (
    <Tabs defaultValue="events" className="mb-6">
      <TabsList>
        <TabsTrigger value="events">Evenemang</TabsTrigger>
        <TabsTrigger value="swimmers">Simmare</TabsTrigger>
        <TabsTrigger value="files">Filer</TabsTrigger>
        <TabsTrigger value="scoreboard">Resultattavla</TabsTrigger>
      </TabsList>

      <TabsContent value="events" className="mt-6">
        <EventsSection
          meetId={meetId}
          sessions={sessions}
          events={events}
          heats={heats}
          activeSessionId={activeSessionId}
          onSessionChange={setActiveSessionId}
        />
      </TabsContent>

      <TabsContent value="swimmers">
        <EmptyState text="Simmarlista kommer snart..." />
      </TabsContent>

      <TabsContent value="files">
        <EmptyState text="Filer kommer snart..." />
      </TabsContent>

      <TabsContent value="scoreboard">
        <EmptyState text="Resultattavla kommer snart..." />
      </TabsContent>
    </Tabs>
  );
};
