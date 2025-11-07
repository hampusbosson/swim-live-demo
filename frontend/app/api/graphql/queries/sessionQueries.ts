import { gql } from "@apollo/client";

export const GET_SESSIONS_BY_MEET = gql`
  query GetSessionsByMeet($meetId: ID!) {
    sessions(meetId: $meetId) {
      id
      meetId
      name
      startTime
    }
  }
`;