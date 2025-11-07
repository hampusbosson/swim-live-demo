import { gql } from "@apollo/client";

export const GET_HEATS_BY_MEET = gql`
  query GetHeatsByMeet($meetId: ID!) {
    heats(meetId: $meetId) {
      id
      eventId
      number
      startTime
    }
  }
`;

export const GET_HEATS_BY_EVENT = gql`
  query GetHeatsByEvent($eventId: ID!) {
    heats(eventId: $eventId) {
      id
      eventId
      number
      startTime
    }
  }
`;
