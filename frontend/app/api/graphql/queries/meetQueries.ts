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