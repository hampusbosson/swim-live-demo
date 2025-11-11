import { createYoga, createSchema } from "graphql-yoga";
import {
  mockMeets,
  mockSessions,
  mockEvents,
  mockHeats,
  mockLanes,
} from "@/data/mockData";
import { Meet, Heat } from "@/types";

// In-memory DB (mocked data fetched from mockData-file)
const db = {
  meets: mockMeets,
  sessions: mockSessions,
  events: mockEvents,
  heats: mockHeats,
  lanes: mockLanes,
};

const resultsDB: Record<string, unknown[]> = {}; // temp memory (later replace with actual DB)

// Timers per heat (to simulate ongoing heat)
const simulators = new Map<string, NodeJS.Timeout>();

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
    meets: (): Meet[] => db.meets,
    meet: (_: unknown, { id }: { id: string }) =>
      db.meets.find((m) => m.id === id),
    sessions: (_: unknown, { meetId }: { meetId: string }) =>
      db.sessions.filter((s) => s.meetId === meetId),
    events: (_: unknown, { meetId }: { meetId: string }) =>
      db.events.filter((e) => e.meetId === meetId),
    event: (_: unknown, { id }: { id: string }) =>
      db.events.find((e) => e.id === id),
    eventByHeat: (_: unknown, { heatId }: { heatId: string }) => {
      const heat = db.heats.find((h) => h.id === heatId);
      if (!heat) return null;
      return db.events.find((e) => e.id === heat.eventId);
    },
    heats: (
      _: unknown,
      { eventId, meetId }: { eventId?: string; meetId?: string }
    ) => {
      if (eventId) {
        return db.heats.filter((h) => h.eventId === eventId);
      }
      if (meetId) {
        const eventIds = db.events
          .filter((e) => e.meetId === meetId)
          .map((e) => e.id);
        return db.heats.filter((h) => eventIds.includes(h.eventId));
      }
      return db.heats;
    },
    heat: (_: unknown, { id }: { id: string }) =>
      db.heats.find((h) => h.id === id),
    lanes: (_: unknown, { heatId }: { heatId: string }) =>
      db.lanes.filter((l) => l.heatId === heatId),
    heatResults: (_: unknown, { heatId }: { heatId: string }) =>
      resultsDB[heatId] || [],
  },

  Mutation: {
    startHeat: (_: Heat, { heatId }: { heatId: string }) => {
      if (simulators.has(heatId)) return true; // already running

      const now = Date.now();
      const heat = db.heats.find((h) => h.id === heatId);
      if (heat) {
        heat.startTimestamp = now;
      }

      // reset all lanes in heat to starting state
      db.lanes
        .filter((lane) => lane.heatId === heatId)
        .forEach((lane) => {
          lane.status = "ONGOING";
          lane.resultTime = "0.00"; // start all timers from zero
        });

      // Assign random target finish times based on seed time
      const targets = new Map<string, number>();
      db.lanes
        .filter((lane) => lane.heatId === heatId)
        .forEach((lane) => {
          const seedSeconds = parseFloat(lane.seedTime);
          const variance = (Math.random() - 0.3) * 1.5; // add natural randomness
          const target = Math.max(seedSeconds + variance, seedSeconds - 0.5); // prevent unrealistic improvement from seed time (no more than 0.5s improvement)
          targets.set(lane.id, target);
        });

      // update interval every 100 ms
      const t = setInterval(() => {
        const activeLanes = db.lanes.filter(
          (lane) => lane.heatId === heatId && lane.status === "ONGOING"
        );

        // if all lanes have finished, clear interval and clean up
        if (!activeLanes.length) {
          clearInterval(t);
          simulators.delete(heatId);
          return;
        }

        // increment each active lanes current time
        activeLanes.forEach((lane) => {
          const current = parseFloat(lane.resultTime ?? "0");
          const target = targets.get(lane.id) ?? 0;
          const next = current + 0.1;

          if (next >= target) {
            lane.resultTime = target.toFixed(2);
            lane.status = "FINISHED"; // mark lane as done
          } else {
            lane.resultTime = next.toFixed(2); // update lane progress
          }
        });
      }, 100);

      // store interval reference so we can stop/reset later
      simulators.set(heatId, t);
      return true;
    },

    resetHeat: (_: Heat, { heatId }: { heatId: string }) => {
      const t = simulators.get(heatId);
      if (t) {
        clearInterval(t);
        simulators.delete(heatId);
      }

      // clear startTimestamo on the heat
      const heat = db.heats.find((h) => h.id === heatId);
      if (heat) {
        heat.startTimestamp = null;
      }

      db.lanes
        .filter((l) => l.heatId === heatId)
        .forEach((l) => {
          l.status = "WAITING";
          l.resultTime = null;
        });
      return true;
    },

    saveHeatResults: (_: Heat, { heatId }: { heatId: string }) => {
      // get lanes belonging to this heat
      const lanes = db.lanes.filter((l) => l.heatId === heatId);

      // ensure that all lanes are finished before saving
      const allFinished = lanes.every((l) => l.status === "FINISHED");
      if (!allFinished) {
        console.warn(`Heat ${heatId} not yet finished — skipping save.`);
        return []; // return empty array if called before all lanes are finished
      }

      // sort lanes by result time
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

      // save into memory DB
      resultsDB[heatId] = ranked;

      console.log(`Saved results for heat ${heatId}`, ranked);
      return ranked;
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });

//Next.js API integration
export const dynamic = "force-dynamic";
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  graphiql: true,
  fetchAPI: { Response },
});



export { yoga as GET, yoga as POST };
