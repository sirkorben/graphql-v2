import axios from "axios";
import { Transaction } from "../models/user.info";
import { GRAPHQL_URL } from "./GraphqlUrl";


const AUDIT_QUERY_TO_SERVER = async (login: string, offset: number, upOrDown: string) => {
    const AUDIT_QUERY = `
    query UserDownAudit
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: ${upOrDown} }
          object: { type: { _regex: "project" } }
        }
        offset: ${offset}
        order_by: { createdAt: desc }
      ) {
        amount
        createdAt
        path
      }
    }
    `

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: AUDIT_QUERY,
        })
    );
}


const COLLECT_DOWN_OR_UP_AUDIT = async (login: string, upOrDown: string) => {
    let fullDataFetched = false;
    let offset = 0;
    let transactions: Array<Transaction> = []

    const FETCH_AUDITS = async (offset: number) => {
        const res = await AUDIT_QUERY_TO_SERVER(login, offset, upOrDown);

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
        await FETCH_AUDITS(offset);
        if (transactions.length % 50 === 0) {
            offset += 50;
        } else {
            fullDataFetched = true;
        }
    }
    // console.log("transactions from collect data:")
    // console.log(transactions)
    return transactions;
}



export const UP_DOWN_AUDIT_INFO = async (login: string) => {
    const DOWN = "down"
    const UP = "up"
    const responseWithDownAudits = await COLLECT_DOWN_OR_UP_AUDIT(login, DOWN)
    const responseWithUpAudits = await COLLECT_DOWN_OR_UP_AUDIT(login, UP)

    // (Array.from(isDoneProjectsMap.values()).reduce((acc, val) => acc + val, 0) +
    //     PISCINE_JS_XP) /
    // 1000)
    console.log(responseWithDownAudits.map(function (tra) { return tra.amount }).reduce((acc, val) => acc + val, 0))
    console.log(responseWithUpAudits.map(function (tra) { return tra.amount }).reduce((acc, val) => acc + val, 0))

    // console.log(responseWithDownAudits)
    // console.log(responseWithUpAudits)

}

