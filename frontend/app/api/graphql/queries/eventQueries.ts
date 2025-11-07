import { gql } from "@apollo/client";

export const GET_EVENTS_BY_MEET = gql`
  query GetEventsByMeet($meetId: ID!) {
    events(meetId: $meetId) {
      id
      meetId
      sessionId
      name
      distance
      stroke
      category
    }
  }
`;