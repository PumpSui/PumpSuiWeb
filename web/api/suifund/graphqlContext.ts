import { graphql } from "@mysten/sui/graphql/schemas/2024.4";

export const getAllCommentsQL = graphql(`
  query ($id: SuiAddress!, $nextCursor: String) {
    owner(address: $id) {
      dynamicFields(after: $nextCursor) {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        nodes {
          name {
            json
          }
          value {
            ... on MoveValue {
              json
              bcs
            }
          }
        }
      }
    }
  }
`);

export const getAdminCap = graphql(`
  query ($address: SuiAddress!) {
    address(address: $address) {
      objects(
        filter: {
          type: "0x257d035780276a41187b9bac21ca05e73a69b6c93f06e786cc18e8da78832808::suifund::ProjectAdminCap"
        }
      ) {
        nodes {
          contents {
            json
          }
        }
      }
    }
  }
`);
