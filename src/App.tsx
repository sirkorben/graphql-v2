import { useState } from 'react';
import Header from './componenets/Header';
import BasicInformation from './componenets/BasicInformation';
import { Col, Container, Row } from 'react-bootstrap';
import UserCharts from './componenets/UserCharts';

function App() {
  const [login, setLogin] = useState("")
  const [displayGraphics, setDisplayGraphics] = useState(false)


  return (
    <div className="App">
      <Header setLoginToFetch={setLogin} />
      <Container className="mt-4">
        <div className="mx-auto" style={{ width: '400px' }}>
          {login && <BasicInformation login={login} setDisplayGraphics={setDisplayGraphics} />}
        </div>
      </Container>
      <Container className="mt-4">
        {displayGraphics ? <><UserCharts login={login}></UserCharts></> : <>suppose charts are hidden</>}
      </Container>

    </div>
  );
}

export default App;
