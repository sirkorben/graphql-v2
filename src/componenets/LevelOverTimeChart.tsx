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
        const res = await LEVEL_OVER_TIME_INFO(userLogin)
        return res
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '',
            },
        },
    };

    const data = {
        labels: labelsFromKeys,
        datasets: [
            {
                label: 'Level',
                // data: transactions?.map((transaction) => transaction.amount),
                data: labelsFromKeys?.map(label => transactions?.get(label)),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ],
    };

    return (
        <div className="mt-4">
            <>
                <b>Level gained while Div-01 project passed</b>
                <Line options={options} data={data} />
            </>
        </div>
    )
}

export default LevelOverTimeChart