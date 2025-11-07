import { createYoga, createSchema } from "graphql-yoga";
import {
  mockMeets,
  mockSessions,
  mockEvents,
  mockHeats,
  mockLanes,
  type Meet,
  type Session,
  type Event,
  type Heat,
  type Lane,
} from "@/data/mockData";

// ---- In-memory DB (mockad data hämtad från din mockData-fil) ----
const db = {
  meets: mockMeets,
  sessions: mockSessions,
  events: mockEvents,
  heats: mockHeats,
  lanes: mockLanes,
};

// Timers per heat (för att simulera pågående lopp)
const simulators = new Map<string, NodeJS.Timeout>();

// ---- GraphQL-schema ----
const typeDefs = /* GraphQL */ `
  type Meet {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
    location: String!
    bannerUrl: String!
  }

  type Session {
    id: ID!
    meetId: ID!
    name: String!
    startTime: String!
  }

  type Event {
    id: ID!
    meetId: ID!
    sessionId: ID!
    name: String!
    distance: Int!
    stroke: String!
    category: String!
  }

  type Heat {
    id: ID!
    eventId: ID!
    number: Int!
    startTime: String!
  }

  type Lane {
    id: ID!
    heatId: ID!
    lane: Int!
    swimmer: String!
    club: String!
    year: Int!
    seedTime: String!
    resultTime: String
    status: String!
  }

  type Query {
    meets: [Meet!]!
    meet(id: ID!): Meet
    sessions(meetId: ID!): [Session!]!
    events(meetId: ID!): [Event!]!
    event(id: ID!): Event
    heats(eventId: ID!): [Heat!]!
    heat(id: ID!): Heat
    lanes(heatId: ID!): [Lane!]!
  }

  type Mutation {
    startHeat(heatId: ID!): Boolean!
    resetHeat(heatId: ID!): Boolean!
  }
`;

// ---- Resolvers ----
const resolvers = {
  Query: {
    meets: (): Meet[] => db.meets,
    meet: (_: Meet, { id }: { id: string }) => db.meets.find((m) => m.id === id),
    sessions: (_: Session[], { meetId }: { meetId: string }) =>
      db.sessions.filter((s) => s.meetId === meetId),
    events: (_: Event[], { meetId }: { meetId: string }) =>
      db.events.filter((e) => e.meetId === meetId),
    event: (_: Event, { id }: { id: string }) => db.events.find((e) => e.id === id),
    heats: (_: Event[], { eventId }: { eventId: string }) =>
      db.heats.filter((h) => h.eventId === eventId),
    heat: (_: Heat, { id }: { id: string }) => db.heats.find((h) => h.id === id),
    lanes: (_: Lane[], { heatId }: { heatId: string }) =>
      db.lanes.filter((l) => l.heatId === heatId),
  },

  Mutation: {
    startHeat: (_: any, { heatId }: { heatId: string }) => {
      if (simulators.has(heatId)) return true; // redan igång

      // Nollställ heat
      db.lanes
        .filter((l) => l.heatId === heatId)
        .forEach((l) => {
          l.status = "WAITING";
          l.resultTime = null;
        });

      // Simulera uppdateringar var 1.2 sek
      const t = setInterval(() => {
        const updatable = db.lanes.filter(
          (l) =>
            l.heatId === heatId &&
            (l.status === "WAITING" || l.status === "ONGOING")
        );

        if (!updatable.length) {
          clearInterval(t);
          simulators.delete(heatId);
          return;
        }

        const lane = updatable[Math.floor(Math.random() * updatable.length)];
        if (lane.status === "WAITING") {
          lane.status = "ONGOING";
        } else {
          const seedSeconds = parseFloat(lane.seedTime);
          const variance = (Math.random() - 0.3) * 1.5;
          const resultSeconds = Math.max(
            seedSeconds + variance,
            seedSeconds - 0.5
          );
          lane.resultTime = resultSeconds.toFixed(2);
          lane.status = "FINISHED";
        }
      }, 1200);

      simulators.set(heatId, t);
      return true;
    },

    resetHeat: (_: any, { heatId }: { heatId: string }) => {
      const t = simulators.get(heatId);
      if (t) {
        clearInterval(t);
        simulators.delete(heatId);
      }
      db.lanes
        .filter((l) => l.heatId === heatId)
        .forEach((l) => {
          l.status = "WAITING";
          l.resultTime = null;
        });
      return true;
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });

// ---- Next.js API integration ----
export const dynamic = "force-dynamic"; // ingen caching
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  graphiql: true,
  fetchAPI: { Response },
});

export { yoga as GET, yoga as POST };