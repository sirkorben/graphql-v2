import { useState } from 'react';
import Header from './componenets/Header';
import BasicInformation from './componenets/BasicInformation';
import { Container } from 'react-bootstrap';
import UserCharts from './componenets/UserCharts';

function App() {
  const [login, setLogin] = useState("")
  const [displayGraphics, setDisplayGraphics] = useState(false)

  return (
    <div className="App">
      <Header setLoginToFetch={setLogin} />
      <Container className="mt-4">
        <div style={{ width: '400px' }}>
          {login && <BasicInformation login={login} setDisplayGraphics={setDisplayGraphics} />}
        </div>
      </Container>
      <Container className="mt-4">
        {displayGraphics ? <><UserCharts login={login}></UserCharts></> : <></>}
      </Container>
    </div>
  );
}

export default App;
