import { gql } from "@apollo/client";

export const GET_MEETS = gql`
  query GetMeets {
    meets {
      id
      name
      location
      startDate
      endDate
      bannerUrl
    }
  }
`;


export const GET_MEET_BY_ID = gql`
  query GetMeet($id: ID!) {
    meet(id: $id) {
      id
      name
      location
      startDate
      endDate
      bannerUrl
    }
  }
`;