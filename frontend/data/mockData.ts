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

export const mockMeets: Meet[] = [
  {
    id: "m1",
    name: "Svenska Mästerskapen 2025",
    startDate: "2025-03-15",
    endDate: "2025-03-17",
    location: "Eriksdalsbadet, Stockholm",
    bannerUrl:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=400&fit=crop",
  },
  {
    id: "m2",
    name: "Vårcupen Junior",
    startDate: "2025-04-05",
    endDate: "2025-04-06",
    location: "Fyrishov, Uppsala",
    bannerUrl:
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1200&h=400&fit=crop",
  },
];

export const mockSessions: Session[] = [
  {
    id: "s1",
    meetId: "m1",
    name: "Försökspass 1",
    startTime: "2025-03-15T09:00:00",
  },
  {
    id: "s2",
    meetId: "m1",
    name: "Försökspass 2",
    startTime: "2025-03-15T14:00:00",
  },
  {
    id: "s3",
    meetId: "m1",
    name: "Finaler Dag 1",
    startTime: "2025-03-15T18:00:00",
  },
  {
    id: "s4",
    meetId: "m1",
    name: "Försökspass 3",
    startTime: "2025-03-16T09:00:00",
  },
  {
    id: "s5",
    meetId: "m1",
    name: "Finaler Dag 2",
    startTime: "2025-03-16T18:00:00",
  },
  {
    id: "s6",
    meetId: "m2",
    name: "Försökspass",
    startTime: "2025-04-05T10:00:00",
  },
  { id: "s7", meetId: "m2", name: "Finaler", startTime: "2025-04-05T16:00:00" },
];

export const mockEvents: Event[] = [
  {
    id: "e1",
    meetId: "m1",
    sessionId: "s1",
    name: "50m Frisim P16 Försök",
    distance: 50,
    stroke: "Frisim",
    category: "P16",
  },
  {
    id: "e2",
    meetId: "m1",
    sessionId: "s1",
    name: "100m Ryggsim F18 Försök",
    distance: 100,
    stroke: "Ryggsim",
    category: "F18",
  },
  {
    id: "e3",
    meetId: "m1",
    sessionId: "s3",
    name: "50m Frisim P16 Final",
    distance: 50,
    stroke: "Frisim",
    category: "P16",
  },
  {
    id: "e4",
    meetId: "m1",
    sessionId: "s3",
    name: "200m Medley F18 Final",
    distance: 200,
    stroke: "Medley",
    category: "F18",
  },
  {
    id: "e5",
    meetId: "m2",
    sessionId: "s6",
    name: "50m Fjärilsim P14 Försök",
    distance: 50,
    stroke: "Fjärilsim",
    category: "P14",
  },
];

export const mockHeats: Heat[] = [
  { id: "h1", eventId: "e1", number: 1, startTime: "2025-03-15T09:15:00" },
  { id: "h2", eventId: "e1", number: 2, startTime: "2025-03-15T09:20:00" },
  { id: "h3", eventId: "e2", number: 1, startTime: "2025-03-15T09:30:00" },
  { id: "h4", eventId: "e3", number: 1, startTime: "2025-03-15T18:15:00" },
  { id: "h5", eventId: "e4", number: 1, startTime: "2025-03-15T18:45:00" },
  { id: "h6", eventId: "e5", number: 1, startTime: "2025-04-05T10:15:00" },
];

export const mockLanes: Lane[] = [
  // Heat 1 (h1) - 50m Frisim P16 Försök
  {
    id: "l1",
    heatId: "h1",
    lane: 1,
    swimmer: "Erik Andersson",
    club: "Spårvägen SF",
    year: 2009,
    seedTime: "24.56",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l2",
    heatId: "h1",
    lane: 2,
    swimmer: "Oscar Lindström",
    club: "SK Neptun",
    year: 2009,
    seedTime: "23.89",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l3",
    heatId: "h1",
    lane: 3,
    swimmer: "Viktor Svensson",
    club: "Jönköpings SS",
    year: 2009,
    seedTime: "23.12",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l4",
    heatId: "h1",
    lane: 4,
    swimmer: "Lucas Bergström",
    club: "SKK SK",
    year: 2009,
    seedTime: "22.67",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l5",
    heatId: "h1",
    lane: 5,
    swimmer: "Emil Johansson",
    club: "Malmö KK",
    year: 2009,
    seedTime: "22.89",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l6",
    heatId: "h1",
    lane: 6,
    swimmer: "Alex Karlsson",
    club: "Helsingborg SS",
    year: 2009,
    seedTime: "23.45",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l7",
    heatId: "h1",
    lane: 7,
    swimmer: "Noah Pettersson",
    club: "Upsala SS",
    year: 2009,
    seedTime: "24.01",
    resultTime: null,
    status: "WAITING",
  },
  {
    id: "l8",
    heatId: "h1",
    lane: 8,
    swimmer: "William Eklund",
    club: "Göteborg SS",
    year: 2009,
    seedTime: "24.78",
    resultTime: null,
    status: "WAITING",
  },
  // Heat 4 (h4) - 50m Frisim P16 Final
  {
    id: "l9",
    heatId: "h4",
    lane: 1,
    swimmer: "Viktor Svensson",
    club: "Jönköpings SS",
    year: 2009,
    seedTime: "23.12",
    resultTime: "23.05",
    status: "OFFICIAL",
  },
  {
    id: "l10",
    heatId: "h4",
    lane: 2,
    swimmer: "Oscar Lindström",
    club: "SK Neptun",
    year: 2009,
    seedTime: "23.89",
    resultTime: "23.67",
    status: "OFFICIAL",
  },
  {
    id: "l11",
    heatId: "h4",
    lane: 3,
    swimmer: "Emil Johansson",
    club: "Malmö KK",
    year: 2009,
    seedTime: "22.89",
    resultTime: "22.78",
    status: "OFFICIAL",
  },
  {
    id: "l12",
    heatId: "h4",
    lane: 4,
    swimmer: "Lucas Bergström",
    club: "SKK SK",
    year: 2009,
    seedTime: "22.67",
    resultTime: "22.45",
    status: "OFFICIAL",
  },
  {
    id: "l13",
    heatId: "h4",
    lane: 5,
    swimmer: "Alex Karlsson",
    club: "Helsingborg SS",
    year: 2009,
    seedTime: "23.45",
    resultTime: "23.12",
    status: "OFFICIAL",
  },
  {
    id: "l14",
    heatId: "h4",
    lane: 6,
    swimmer: "Noah Pettersson",
    club: "Upsala SS",
    year: 2009,
    seedTime: "24.01",
    resultTime: "23.89",
    status: "OFFICIAL",
  },
];
