import { gql } from "@apollo/client";

export const START_HEAT = gql`
  mutation StartHeat($heatId: ID!) {
    startHeat(heatId: $heatId)
  }
`;

export const RESET_HEAT = gql`
  mutation ResetHeat($heatId: ID!) {
    resetHeat(heatId: $heatId)
  }
`;

export const SAVE_HEAT_RESULTS = gql`
  mutation SaveHeatResults($heatId: ID!) {
    saveHeatResults(heatId: $heatId) {
      lane
      swimmer
      club
      resultTime
      rank
    }
  }
`;

