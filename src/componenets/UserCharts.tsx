import AuditsChart from './AuditsChart';
import LevelOverTimeChart from './LevelOverTimeChart';

interface UserChartsProps {
    login: string
}

const UserCharts: React.FunctionComponent<UserChartsProps> = ({ login }) => {

    return (
        <>
            <LevelOverTimeChart login={login} />
            <AuditsChart login={login} />
        </>
    )
}

export default UserCharts;
