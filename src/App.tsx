import { useState } from 'react';
import Header from './componenets/Header';
import BasicInformation from './componenets/BasicInformation';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  const [login, setLogin] = useState("")

  return (
    <div className="App">
      <Header setLoginToFetch={setLogin} />
      <Container>
        <Row className="mt-4">
          {login && <BasicInformation login={login} />}
        </Row>
      </Container>
    </div>
  );
}

export default App;
