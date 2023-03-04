import { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { UserInfo } from '../models/user.info';
import { XP_AMOUNT } from '../queries/CollectBasicInfo';

type Props = {
    login: string
}

function BasicInformation({ login }: Props) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    XP_AMOUNT(login).then((promisedUserInfo) => {
        setUserInfo(promisedUserInfo)
    });

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>profile of <br /><b>{login}</b></Card.Title>
                <Card.Text> {userInfo &&
                    <>
                        User ID: {userInfo.id} <br />
                        User level: {userInfo.level} <br />
                        User xp: {userInfo.xp}
                    </>}
                </Card.Text>
                <Button variant="primary">Show more</Button>
            </Card.Body>
        </Card>

    );
}

export default BasicInformation