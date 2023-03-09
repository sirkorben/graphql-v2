import { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { UserInfo } from '../models/user.info';
import { AUDIT_RATIO } from '../service/CollectAuditsInfo';
import { BASIC_INFO } from '../service/CollectBasicInfo';

type BasicInformationProps = {
    login: string,
    setDisplayGraphics: Function,
}

const BasicInformation: React.FunctionComponent<BasicInformationProps> = ({ login, setDisplayGraphics }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const basicInfo = await fetchBasicInfo(login)
            setUserInfo(basicInfo)
        }
        getData()
    }, [login])

    const fetchBasicInfo = async (userLogin: string) => {
        const res = await BASIC_INFO(userLogin)
        return res
    }

    const fetchAuditRatio = async (userLogin: string) => {
        const res = await AUDIT_RATIO(userLogin)
        return res
    }

    const showMoreClicked = () => {
        setShowMore(!showMore)
        setDisplayGraphics(!showMore)
    }



    return (
        <>
            <Card className="bg-dark text-white" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title><b>{login}</b></Card.Title>
                    {userInfo?.login !== "" ? <>
                        <Card.Text> {userInfo &&
                            <>
                                id: {userInfo.id} <br />
                                level: {userInfo.level} <br />
                                xp: {userInfo.xp} <br />
                                audit ratio : {userInfo.auditRatio}
                            </>}
                        </Card.Text>
                        <Button variant="primary" onClick={showMoreClicked}> {showMore ? <>Close</> : <>Show more</>}</Button>
                    </> : <>
                        <Card.Text>
                            User not found
                        </Card.Text>
                    </>}
                </Card.Body>
            </Card>
        </>
    );
}

export default BasicInformation