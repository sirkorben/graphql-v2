import axios from "axios";
import { GRAPHQL_URL } from "./GraphqlUrl";
import { Transaction } from "../models/user.info";

const LEVEL_DATA_QUERY_TO_SERVER = async (login: string, offset: number) => {
  const LEVEL_QUERY = `
    query UserLevelOverTime
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: "level" }
        	object: { type: { _regex: "project|piscine" } }
          path: {  _niregex: "/piscine-go/" }
        }
        offset: ${offset}
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
        path
        object{
          name
          type
        }
      }
    }`

  return await axios.post(
    GRAPHQL_URL,
    JSON.stringify({
      query: LEVEL_QUERY,
    })
  );
}

const COLLECT_LEVEL_DATA = async (login: string) => {
  let fullDataFetched = false;
  let transactions: Array<Transaction> = [];
  let offset = 0;

  const FETCH_XP_DATA = async (login: string, offset: number) => {
    const res = await LEVEL_DATA_QUERY_TO_SERVER(login, offset);
    if (res.data.data.transaction) {
      res.data.data.transaction.forEach((transaction: Transaction) =>
        transactions.push(transaction)
      );
    } else {
      fullDataFetched = true
      console.log("no results");
    }
  };

  while (!fullDataFetched) {
    await FETCH_XP_DATA(login, offset);
    if (transactions.length % 50 === 0) {
      offset += 50;
    } else {
      fullDataFetched = true;
    }
  }
  return transactions;
};

export const LEVEL_OVER_TIME_INFO = async (login: string) => {
  let levelTimeMap = new Map<string, number>()
  let arr: Transaction[] = (await COLLECT_LEVEL_DATA(login))
  arr.forEach(transaction => levelTimeMap.set(transaction.createdAt.split("T")[0], transaction.amount))

  return levelTimeMap;
}
