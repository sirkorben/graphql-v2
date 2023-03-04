import axios from "axios";
import { GRAPHQL_URL } from "./GraphqlUrl";
import { Transaction, Progress, UserInfo } from "../models/user.info";

const LEVEL_DATA_QUERY_TO_SERVER = async (login: string) => {
    const LEVEL_QUERY = `
    query UserLevel
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: "level" }
          object: { type: { _regex: "project" } }
        }
        limit: 1
        order_by: { amount: desc }
      ) {
        userId
        amount
      }
    }`

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: LEVEL_QUERY,
        })
    );
}

const PROGRESS_DATA_QUERY_TO_SERVER = async (login: string, offset: number) => {
    const PROGRESS_QUERY = `
    query UserProgress{
  
        user(where: {login: {_eq: ${login}}})
        {
          progresses(
            where: {
                isDone: {_eq: true}, 
                path: {_niregex: "/johvi/div-01/piscine-js-2|/johvi/div-01/piscine-js|/johvi/onboarding/|/johvi/piscine-go|/johvi/div-01/rust"}
              }
            offset: ${offset}
              order_by: {path: asc})
          {
            createdAt
            isDone
            path
            # object {
            #   name
            # }
          }
        }
          
      }
  `;

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: PROGRESS_QUERY,
        })
    );
};

const XP_DATA_QUERY_TO_SERVER = async (login: string, offset: number) => {
    const XP_QUERY = `
        query UserXpForAllTransactions
          {
            user(where: { login: { _eq: ${login} } }) {
              login
              transactions(
                offset: ${offset}
                order_by: { amount: asc }
                where: {
                  type: { _eq: "xp" }
                  path: {_niregex: "/johvi/div-01/piscine-js-2|/johvi/div-01/piscine-js|/johvi/onboarding/|/johvi/piscine-go|/johvi/div-01/rust"}
                }
              ) {
                amount
                object {
                  name
                }
                type
                path
              }
            }
          }
        `;
    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: XP_QUERY,
        })
    );
};

const COLLECT_PROGRESS_DATA = async (login: string) => {
    let isDoneProjectsMap = new Map<string, number>();
    let fullDataFetched = false;
    let offset = 0;

    const FETCH_PROGRESS_DATA = async (login: string, offset: number) => {
        const res = await PROGRESS_DATA_QUERY_TO_SERVER(login, offset);
        if (res.data.data.user[0]?.progresses) {
            res.data.data.user[0]?.progresses.forEach((isDoneProject: Progress) => {
                isDoneProjectsMap.set(isDoneProject.path, 0);
            });
        } else {
            console.log("no results");
        }
    };

    while (!fullDataFetched) {
        await FETCH_PROGRESS_DATA(login, offset);
        if (isDoneProjectsMap.size % 50 === 0) {
            offset += 50;
        } else {
            fullDataFetched = true;
        }
    }

    return isDoneProjectsMap;
};

const COLLECT_XP_DATA = async (login: string) => {
    let fullDataFetched = false;
    let transactions: Array<Transaction> = [];
    let offset = 0;

    const FETCH_XP_DATA = async (login: string, offset: number) => {
        const res = await XP_DATA_QUERY_TO_SERVER(login, offset);
        if (res.data.data.user[0]?.transactions) {
            res.data.data.user[0]?.transactions.forEach((transaction: Transaction) =>
                transactions.push(transaction)
            );
        } else {
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

const COLLECT_ID_AND_LEVEL_DATA = async (login: string) => {
    let idLevelInfo: UserInfo = {
        login: "",
    };

    const FETCH_LEVEL_DATA = async (login: string) => {
        const res = await LEVEL_DATA_QUERY_TO_SERVER(login);
        idLevelInfo.id = res.data.data.transaction[0].userId
        idLevelInfo.level = res.data.data.transaction[0].amount

    };
    await FETCH_LEVEL_DATA(login)
    return idLevelInfo;
}

export const XP_AMOUNT = async (login: string) => {

    //TODO: make an initial query to verify user exists with such login, if result is empty, stop further logic

    const PISCINE_JS_XP = 70000;
    const isDoneProjectsMap = await COLLECT_PROGRESS_DATA(login);
    const allTransactions = await COLLECT_XP_DATA(login);
    const idAndLevel = await COLLECT_ID_AND_LEVEL_DATA(login)

    allTransactions.forEach((transaction) => {
        if (isDoneProjectsMap.has(transaction.path)) {
            isDoneProjectsMap.set(transaction.path, transaction.amount);
        }
    });

    let userInfo: UserInfo = {
        login: login,
    };

    userInfo.id = idAndLevel.id
    userInfo.level = idAndLevel.level;
    userInfo.xp = Math.round(
        (Array.from(isDoneProjectsMap.values()).reduce((acc, val) => acc + val, 0) +
            PISCINE_JS_XP) /
        1000
    );

    return userInfo;
};
