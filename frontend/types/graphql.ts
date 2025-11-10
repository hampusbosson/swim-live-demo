import { Meet, Session } from "./meet";
import { Event } from "./event";
import { Heat, Lane } from "./heat";

export interface GetMeetsData {
  meets: Meet[];
}

export interface GetMeetByIdData {
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

export interface GetLanesData {
  lanes: Lane[];
}

export interface GetEventByHeatData {
  eventByHeat: Event;
}

export interface GetHeatByIdData {
  heat: Heat;
}