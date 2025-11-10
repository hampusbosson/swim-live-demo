"use client";

import { SessionSidebar } from "@/components/SessionSidebar";
import { EventCard } from "@/components/EventCard";
import { Event, Heat, Session } from "@/types";
import { EmptyState } from "./ui/empty-state";

interface EventsSectionProps {
  meetId: string;
  sessions: Session[];
  events: Event[];
  heats: Heat[];
  activeSessionId?: string;
  onSessionChange: (id: string) => void;
}

export const EventsSection = ({
  meetId,
  sessions,
  events,
  heats,
  activeSessionId,
  onSessionChange,
}: EventsSectionProps) => {
  const eventsForSession = events.filter(
    (e) => e.sessionId === activeSessionId
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sessions Sidebar */}
      <div className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-20">
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionClick={onSessionChange}
          />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Evenemang
        </h2>
        {eventsForSession.length === 0 ? (
            <EmptyState text="Inga evenemang för vald session" />
        ) : (
          <div className="space-y-3">
            {eventsForSession.map((event) => {
              const allHeats = heats.filter((h) => h.eventId === event.id);
              return (
                <EventCard
                  meetId={meetId}
                  event={event}
                  heats={allHeats}
                  key={event.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};