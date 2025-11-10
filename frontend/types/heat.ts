export type LaneStatus = "WAITING" | "ONGOING" | "FINISHED" | "OFFICIAL";

export interface Heat {
  id: string;
  eventId: string;
  number: number;
  startTime: string;
  startTimestamp: number | null;
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
  status: LaneStatus;
}