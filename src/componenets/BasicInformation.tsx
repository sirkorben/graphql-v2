import { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { UserInfo } from '../models/user.info';
import { BASIC_INFO } from '../service/CollectBasicInfo';

type BasicInformationProps = {
    login: string,
    setDisplayGraphics: Function,
}

const BasicInformation: React.FunctionComponent<BasicInformationProps> = ({ login, setDisplayGraphics }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showMore, setShowMore] = useState(false)

    BASIC_INFO(login).then((promisedUserInfo) => {
        setUserInfo(promisedUserInfo)
    });

    const showMoreClicked = () => {
        setShowMore(!showMore)
        setDisplayGraphics(!showMore)
    }

    return (
        <>
            <Card className="bg-dark text-white" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>profile of <br /><b>{login}</b></Card.Title>
                    <Card.Text> {userInfo &&
                        <>
                            User ID: {userInfo.id} <br />
                            User level: {userInfo.level} <br />
                            User xp: {userInfo.xp}
                        </>}
                    </Card.Text>
                    <Button variant="primary" onClick={showMoreClicked}> {showMore ? <>Close</> : <>Show more</>}</Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default BasicInformation