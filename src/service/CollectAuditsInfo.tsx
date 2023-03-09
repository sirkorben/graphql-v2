import axios from "axios";
import { AuditTransactions, Transaction } from "../models/user.info";
import { GRAPHQL_URL } from "./GraphqlUrl";


const DOWN = "down"
const UP = "up"
const MONTHS_NAME = new Map<string, string>([
    ["01", "January"],
    ["02", "February"],
    ["03", "March"],
    ["04", "April"],
    ["05", "May"],
    ["06", "June"],
    ["07", "July"],
    ["08", "August"],
    ["09", "September"],
    ["10", "October"],
    ["11", "November"],
    ["12", "December"],
])

const AUDIT_QUERY_TO_SERVER = async (login: string, offset: number, upOrDown: string) => {
    const AUDIT_QUERY = `
    query UserAudit
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: ${upOrDown} }
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

    return transactions;
}

const CALC_SUM_OF_AUDIT_BY_MONTH = (transactions: Transaction[]) => {
    let amount = transactions[0].amount
    let calculatedAuditArr: Transaction[] = []
    for (let i = 1; i < transactions.length; i++) {
        if (transactions[i - 1].createdAt !== transactions[i].createdAt) {
            let newTransaction: Transaction = {
                amount: Math.round(amount),
                createdAt: transactions[i - 1].createdAt,
            }
            calculatedAuditArr.push(newTransaction)
            amount = transactions[i].amount
        } else {
            amount += transactions[i].amount
            if (i === (transactions.length - 1)) {
                let newTransaction: Transaction = {
                    amount: Math.round(amount),
                    createdAt: transactions[i].createdAt,
                }
                calculatedAuditArr.push(newTransaction)
            }
        }
    }
    return calculatedAuditArr;
}

export const UP_DOWN_AUDIT_INFO = async (login: string) => {
    const labels: Array<string> = []

    const responseWithDownAudits: Transaction[] = (await COLLECT_DOWN_OR_UP_AUDIT(login, DOWN)).map(function (tra) {
        let splittedCreatedAt = tra.createdAt.split("T")[0].split("-")
        let newTransaction: Transaction = {
            amount: tra.amount,
            createdAt: `${MONTHS_NAME.get(splittedCreatedAt[1])!} ${splittedCreatedAt[0]}`,
            path: tra.path,
        }
        return newTransaction
    })

    const responseWithUpAudits: Transaction[] = (await COLLECT_DOWN_OR_UP_AUDIT(login, UP)).map(function (tra) {
        let splittedCreatedAt = tra.createdAt.split("T")[0].split("-")
        let newTransaction: Transaction = {
            amount: tra.amount,
            createdAt: `${MONTHS_NAME.get(splittedCreatedAt[1])!} ${splittedCreatedAt[0]}`,
            path: tra.path,
        }
        return newTransaction
    })

    const upTransactions = CALC_SUM_OF_AUDIT_BY_MONTH(responseWithUpAudits)
    const downTransactions = CALC_SUM_OF_AUDIT_BY_MONTH(responseWithDownAudits)

    downTransactions.forEach(transaction => labels.push(transaction.createdAt))
    upTransactions.forEach(transaction => labels.push(transaction.createdAt))

    const uniqueLabels = labels
        .filter((c, index) => labels.indexOf(c) === index)
        .map(dateString => new Date(`${dateString} 01`))
        .sort((a, b) => b.getTime() - a.getTime())
        .map(date => `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);

    let transactionsArr: AuditTransactions = {
        upTransactions: upTransactions,
        downTransactions: downTransactions,
        labels: uniqueLabels,
    };

    return transactionsArr;

}

export const AUDIT_RATIO = async (login: string) => {
    const downAmount = (await COLLECT_DOWN_OR_UP_AUDIT(login, DOWN)).map(function (tra) { return tra.amount }).reduce((acc, val) => acc + val, 0)
    const upAmount = (await COLLECT_DOWN_OR_UP_AUDIT(login, UP)).map(function (tra) { return tra.amount }).reduce((acc, val) => acc + val, 0)

    return (upAmount / downAmount).toFixed(1)
}
