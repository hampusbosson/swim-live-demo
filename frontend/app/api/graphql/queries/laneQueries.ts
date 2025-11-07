import { gql } from "@apollo/client";

export const GET_LANES = gql`
  query GetLanes($heatId: ID!) {
    lanes(heatId: $heatId) {
      id
      lane
      swimmer
      club
      year
      seedTime
      resultTime
      status
    }
  }
`;


