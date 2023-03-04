import * as React from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import SearchForm from './SearchForm';

interface HeaderProps {
  setLoginToFetch: Function
}


const Header: React.FunctionComponent<HeaderProps> = ({ setLoginToFetch }) => {

  const [loginEntered, setLoginEntered] = React.useState("")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginEntered) {
      alert("Please enter username");
      return;
    }

    //TODO: handle special char prohibited

    setLoginToFetch(loginEntered);
    setLoginEntered("");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand >
            type in your/or your school mate login to see kood/Jõhvi profile
          </Navbar.Brand>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={loginEntered}
              onChange={(e) => setLoginEntered(e.target.value)}
            />
            <input type="submit" value="Search" />
            Search
          </Form>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
