import { createYoga, createSchema } from "graphql-yoga";
import {
  mockMeets,
  mockSessions,
  mockEvents,
  mockHeats,
  mockLanes,
} from "@/data/mockData";
import { Meet, Heat } from "@/types";

// Persist timers across invocations
const globalForSim = globalThis as unknown as {
  simulators?: Map<string, NodeJS.Timeout>;
  resultsDB?: Record<string, unknown[]>;
};

if (!globalForSim.simulators) globalForSim.simulators = new Map();
if (!globalForSim.resultsDB) globalForSim.resultsDB = {};

const simulators = globalForSim.simulators;
const resultsDB = globalForSim.resultsDB;

const typeDefs = `
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
    startTimestamp: Float
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

  type HeatResult {
    heatId: ID!
    swimmer: String!
    club: String!
    lane: Int!
    resultTime: String!
    rank: Int!
  }

  type Query {
    meets: [Meet!]!
    meet(id: ID!): Meet
    sessions(meetId: ID!): [Session!]!
    events(meetId: ID!): [Event!]!
    event(id: ID!): Event
    eventByHeat(heatId: ID!): Event
    heats(eventId: ID, meetId: ID): [Heat!]!
    heat(id: ID!): Heat
    lanes(heatId: ID!): [Lane!]!
    heatResults(heatId: ID!): [HeatResult!]!
  }

  type Mutation {
    startHeat(heatId: ID!): Boolean!
    resetHeat(heatId: ID!): Boolean!
    saveHeatResults(heatId: ID!): [HeatResult!]!
  }
`;

const resolvers = {
  Query: {
    meets: (): Meet[] => mockMeets,
    meet: (_: unknown, { id }: { id: string }) =>
      mockMeets.find((m) => m.id === id),
    sessions: (_: unknown, { meetId }: { meetId: string }) =>
      mockSessions.filter((s) => s.meetId === meetId),
    events: (_: unknown, { meetId }: { meetId: string }) =>
      mockEvents.filter((e) => e.meetId === meetId),
    event: (_: unknown, { id }: { id: string }) =>
      mockEvents.find((e) => e.id === id),
    eventByHeat: (_: unknown, { heatId }: { heatId: string }) => {
      const heat = mockHeats.find((h) => h.id === heatId);
      if (!heat) return null;
      return mockEvents.find((e) => e.id === heat.eventId);
    },
    heats: (
      _: unknown,
      { eventId, meetId }: { eventId?: string; meetId?: string }
    ) => {
      if (eventId)
        return mockHeats.filter((h) => h.eventId === eventId);
      if (meetId) {
        const eventIds = mockEvents
          .filter((e) => e.meetId === meetId)
          .map((e) => e.id);
        return mockHeats.filter((h) => eventIds.includes(h.eventId));
      }
      return mockHeats;
    },
    heat: (_: unknown, { id }: { id: string }) =>
      mockHeats.find((h) => h.id === id),
    lanes: (_: unknown, { heatId }: { heatId: string }) =>
      mockLanes.filter((l) => l.heatId === heatId),
    heatResults: (_: unknown, { heatId }: { heatId: string }) =>
      resultsDB[heatId] || [],
  },

  Mutation: {
    startHeat: (_: Heat, { heatId }: { heatId: string }) => {
      if (simulators.has(heatId)) return true; // already running

      const now = Date.now();
      const heat = mockHeats.find((h) => h.id === heatId);
      if (heat) heat.startTimestamp = now;

      // reset all lanes in heat
      mockLanes
        .filter((lane) => lane.heatId === heatId)
        .forEach((lane) => {
          lane.status = "ONGOING";
          lane.resultTime = "0.00";
        });

      // assign random finish targets
      const targets = new Map<string, number>();
      mockLanes
        .filter((l) => l.heatId === heatId)
        .forEach((lane) => {
          const seedSeconds = parseFloat(lane.seedTime);
          const variance = (Math.random() - 0.3) * 1.5;
          const target = Math.max(seedSeconds + variance, seedSeconds - 0.5);
          targets.set(lane.id, target);
        });

      // simulation loop
      const interval = setInterval(() => {
        const active = mockLanes.filter(
          (l) => l.heatId === heatId && l.status === "ONGOING"
        );

        if (!active.length) {
          clearInterval(interval);
          simulators.delete(heatId);
          return;
        }

        active.forEach((lane) => {
          const current = parseFloat(lane.resultTime ?? "0");
          const target = targets.get(lane.id)!;
          const next = current + 0.1;

          if (next >= target) {
            lane.resultTime = target.toFixed(2);
            lane.status = "FINISHED";
          } else {
            lane.resultTime = next.toFixed(2);
          }
        });
      }, 100);

      simulators.set(heatId, interval);
      return true;
    },

    resetHeat: (_: Heat, { heatId }: { heatId: string }) => {
      const interval = simulators.get(heatId);
      if (interval) {
        clearInterval(interval);
        simulators.delete(heatId);
      }

      const heat = mockHeats.find((h) => h.id === heatId);
      if (heat) heat.startTimestamp = null;

      mockLanes
        .filter((l) => l.heatId === heatId)
        .forEach((l) => {
          l.status = "WAITING";
          l.resultTime = null;
        });

      return true;
    },

    saveHeatResults: (_: Heat, { heatId }: { heatId: string }) => {
      const lanes = mockLanes.filter((l) => l.heatId === heatId);
      const allFinished = lanes.every((l) => l.status === "FINISHED");
      if (!allFinished) {
        console.warn(`Heat ${heatId} not yet finished — skipping save.`);
        return [];
      }

      const ranked = lanes
        .filter((l) => l.resultTime)
        .sort((a, b) => parseFloat(a.resultTime!) - parseFloat(b.resultTime!))
        .map((lane, i) => ({
          heatId,
          swimmer: lane.swimmer,
          club: lane.club,
          lane: lane.lane,
          resultTime: lane.resultTime!,
          rank: i + 1,
        }));

      resultsDB[heatId] = ranked;
      console.log(`✅ Saved results for heat ${heatId}`);
      return ranked;
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });
export const dynamic = "force-dynamic";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  graphiql: true,
  fetchAPI: { Response },
});

export { yoga as GET, yoga as POST };