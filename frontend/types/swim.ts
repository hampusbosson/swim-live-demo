export interface Meet {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl: string;
}

export interface Session {
  id: string;
  meetId: string;
  name: string;
  startTime: string;
}

export interface Event {
  id: string;
  meetId: string;
  sessionId: string;
  name: string;
  distance: number;
  stroke: string;
  category: string;
}

export interface Heat {
  id: string;
  eventId: string;
  number: number;
  startTime: string;
}

export interface Lane {
  id: string;
  heatId: string;
  lane: number;
  swimmer: string;
  club: string;
  year: number;
  seedTime: string;
  resultTime: string | null;
  status: "WAITING" | "ONGOING" | "FINISHED" | "OFFICIAL";
}

export interface GetMeetsData {
    meets: Meet[];
}

export interface GetMeetsByIdData {
    meet: Meet;
}

export interface GetSessionsData {
    sessions: Session[];
}

export interface GetEventsData {
    events: Event[];
}

export interface GetHeatsData {
    heats: Heat[];
}

