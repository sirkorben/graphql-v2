import AuditsChart from './AuditsChart';
import LevelOverTimeChart from './LevelOverTimeChart';
import ProjectXpEarnedChart from './ProjectXpEarnedChart';

interface UserChartsProps {
    login: string
}

const UserCharts: React.FunctionComponent<UserChartsProps> = ({ login }) => {

    return (
        <>
            <LevelOverTimeChart login={login} />
            <ProjectXpEarnedChart login={login} />
            <AuditsChart login={login} />
        </>
    )
}

export default UserCharts;
