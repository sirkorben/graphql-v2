import { useEffect, useState } from "react"
import { PROJECT_XP_EARNED_INFO } from "../service/CollectProjectXpEarned"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type ProjectXpEarnedChartProps = {
    login: string
}

const ProjectXpEarnedChart: React.FunctionComponent<ProjectXpEarnedChartProps> = ({ login }) => {
    const [transactions, setTransactions] = useState<Map<string, number> | undefined>(undefined)
    const [labelsFromKeys, setLabelsFromKeys] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        const getData = async () => {
            const transactions = await fetchLevelOverTimeInfo(login)
            setTransactions(transactions)
            setLabelsFromKeys(Array.from(transactions!.keys()))
        }
        getData()
    }, [login])

    const fetchLevelOverTimeInfo = async (userLogin: string) => {
        const res = await PROJECT_XP_EARNED_INFO(userLogin)
        return res
    }

    const data = {
        labels: labelsFromKeys?.map(taskName => taskName.split("/")[3]),
        datasets: [
            {
                label: '# of Votes',
                data: labelsFromKeys?.map(taskName => transactions?.get(taskName)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mt-4">
            <b>XP earned for project</b>
            <Doughnut data={data} />

        </div>
    )
}

export default ProjectXpEarnedChart;
