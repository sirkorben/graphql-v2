import { UP_DOWN_AUDIT_INFO } from "../service/CollectAuditsInfo";

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from "react";
import { AuditTransactions } from "../models/user.info";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AuditsChartProps {
    login: string
}

const AuditsChart: React.FunctionComponent<AuditsChartProps> = ({ login }) => {
    const [responseData, setResponseData] = useState<AuditTransactions | null>(null)

    useEffect(() => {
        const getData = async () => {
            const auditTransactions = await fetchAuditTransactions(login)
            setResponseData(auditTransactions)
        }
        getData()

    }, [login])

    const fetchAuditTransactions = async (userLogin: string) => {
        const res = await UP_DOWN_AUDIT_INFO(userLogin)
        return res
    }

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderSkipped: true
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: "",
            },
        },
    };

    let labels: Array<string> = []
    labels = responseData?.labels!

    const data = {
        labels,
        datasets: [
            {
                label: 'Audits Received',
                data: responseData?.labels?.map(function (dateString) {
                    let result = responseData?.downTransactions.find(item => item.createdAt === dateString)?.amount;
                    if (result !== undefined) {
                        return result
                    } else {
                        return 0
                    }
                }),
                backgroundColor: 'DarkCyan',
            },
            {
                label: 'Audits Given',
                data: responseData?.labels?.map(function (dateString) {
                    let result = responseData?.upTransactions.find(item => item.createdAt === dateString)?.amount;
                    if (result !== undefined) {
                        return result
                    } else {
                        return 0
                    }
                }),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <>
            <div className="mt-4">
                <p className="text-center"><b>Bar Chart describing user's audits given or recieved</b></p>
                <Bar options={options} data={data} />
            </div>

        </>
    )
}

export default AuditsChart;