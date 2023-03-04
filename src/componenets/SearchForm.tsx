import { Button, Form } from "react-bootstrap";

interface SearchFormProps {
}

const SearchForm: React.FunctionComponent<SearchFormProps> = (props) => {

    return (
      <div>
        SearchForm
        <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
        </Form>
      </div>
    )
}

export default SearchForm;
