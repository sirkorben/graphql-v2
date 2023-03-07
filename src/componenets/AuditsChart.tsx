import { UP_DOWN_AUDIT_INFO } from "../service/CollectAuditsInfo";


interface AuditsChartProps {
    login: string
}

const AuditsChart: React.FunctionComponent<AuditsChartProps> = ({ login }) => {

    const res = UP_DOWN_AUDIT_INFO(login)

    res.then(response => console.log("fetched"))

    return (
        <>
            <div className="mt-4"></div>
            AuditsChart for: {login}
        </>
    )
}

export default AuditsChart;