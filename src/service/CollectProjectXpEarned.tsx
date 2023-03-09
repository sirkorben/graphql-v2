import { COLLECT_PROGRESS_DATA, COLLECT_XP_DATA } from "./CollectBasicInfo";

export const PROJECT_XP_EARNED_INFO = async (login: string) => {

    const isDoneProjectsMap = await COLLECT_PROGRESS_DATA(login);
    const allTransactions = await COLLECT_XP_DATA(login);

    allTransactions.forEach((transaction) => {
        if (isDoneProjectsMap.has(transaction.path!)) {
            isDoneProjectsMap.set(transaction.path!, transaction.amount);
        }
    });

    return isDoneProjectsMap
}


