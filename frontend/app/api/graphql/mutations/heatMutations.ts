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