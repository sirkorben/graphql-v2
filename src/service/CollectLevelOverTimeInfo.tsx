import axios from "axios";
import { GRAPHQL_URL } from "./GraphqlUrl";
import { Transaction } from "../models/user.info";

const LEVEL_DATA_QUERY_TO_SERVER = async (login: string) => {
  const LEVEL_QUERY = `
    query UserLevelOverTime
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: "level" }
          object: { type: { _regex: "project" } }
        }
        order_by: { amount: asc }
      ) {
        amount
        createdAt
        path
      }
    }`

  return await axios.post(
    GRAPHQL_URL,
    JSON.stringify({
      query: LEVEL_QUERY,
    })
  );
}

export const LEVEL_OVER_TIME_INFO = async (login: string) => {
  let levelTimeMap = new Map<string, number>()
  //TODO: handle possible case where results are more than 50
  let arr: Transaction[] = (await LEVEL_DATA_QUERY_TO_SERVER(login)).data.data.transaction
  arr.forEach(transaction => levelTimeMap.set(transaction.createdAt, transaction.amount))
  console.log(levelTimeMap)

  return arr;
}
