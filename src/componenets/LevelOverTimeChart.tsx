import { LEVEL_OVER_TIME_INFO } from '../service/CollectLevelOverTimeInfo';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Transaction } from '../models/user.info';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LevelOverTimeChartProps {
    login: string
}

const LevelOverTimeChart: React.FunctionComponent<LevelOverTimeChartProps> = ({ login }) => {
    //maybe useState([])   ?
    const [transactions, setTransactions] = useState<Transaction[] | null>(null)

    useEffect(() => {
        LEVEL_OVER_TIME_INFO(login).then((response: Transaction[]) => {
            setTransactions(response)
        })
    }, [login])


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Level gained while Div-01 project passed',
            },
        },
    };

    // TODO: make real time chart with dates
    // first date: date of first complete project
    // last date: date today

    const labels = transactions?.map(function (transaction) { return transaction.createdAt?.split("T")[0] })

    const data = {
        labels,
        datasets: [
            {
                label: 'Level ',
                data: transactions?.map((transaction) => transaction.amount),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ],
    };

    console.log(transactions)
    return (
        <>
            User Level Over Time for: {login}
            <Line options={options} data={data} />
        </>
    )
}

export default LevelOverTimeChart