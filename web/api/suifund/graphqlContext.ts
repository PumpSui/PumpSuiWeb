import { graphql } from "@mysten/sui/graphql/schemas/2024.4";

export const getAllCommentsQL = graphql(`
  query ($id: SuiAddress!) {
    owner(address: $id) {
      dynamicFields {
        nodes {
          name {
            ...Value
          }
          value {
            __typename
            ... on MoveValue {
              ...Value
            }
            ... on MoveObject {
              contents {
                ...Value
              }
            }
          }
        }
      }
    }
  }

  fragment Value on MoveValue {
    type {
      repr
    }
    json
  }
`);