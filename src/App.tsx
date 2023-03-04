import { useState } from 'react';
import Header from './componenets/Header';
import BasicInformation from './componenets/BasicInformation';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  const [login, setLogin] = useState("")

  const displayName = (loginFromSearch: string) => {
    setLogin(loginFromSearch)
  }

  return (
    <div className="App">
      <Header parentFunction={displayName} />
      <Container>
        <Row className="mt-4">
          {login && <BasicInformation login={login} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;
