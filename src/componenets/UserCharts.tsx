import AuditsChart from './AuditsChart';
import LevelOverTimeChart from './LevelOverTimeChart';
import ProjectXpEarnedChart from './ProjectXpEarnedChart';

interface UserChartsProps {
    login: string
}

const UserCharts: React.FunctionComponent<UserChartsProps> = ({ login }) => {

    return (
        <div className='w-75 p-3'>
            <LevelOverTimeChart login={login} />
            <AuditsChart login={login} />
            <ProjectXpEarnedChart login={login} />
        </div>
    )
}

export default UserCharts;
