import { Session } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId?: string;
  onSessionClick: (sessionId: string) => void;
  className?: string;
}

export const SessionSidebar = ({
  sessions,
  activeSessionId,
  onSessionClick,
  className,
}: SessionSidebarProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <aside className={cn("space-y-2", className)}>
      <h2 className="font-semibold text-lg text-foreground px-2 mb-3">
        Sessioner
      </h2>
      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={cn(
              "p-3 cursor-pointer transition-all hover:shadow-md border",
              activeSessionId === session.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card hover:bg-muted"
            )}
            onClick={() => onSessionClick(session.id)}
            role="button"
            tabIndex={0}
            aria-pressed={activeSessionId === session.id}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSessionClick(session.id);
              }
            }}
          >
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session.name}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    activeSessionId === session.id
                      ? "opacity-90"
                      : "text-muted-foreground"
                  )}
                >
                  {formatTime(session.startTime)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </aside>
  );
};