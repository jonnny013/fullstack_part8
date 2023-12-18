import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from "../queries"
import AuthorBirthYear from './AuthorBirthYear'
import Table from 'react-bootstrap/Table';

const Authors = props => {
  const result = useQuery(ALL_AUTHORS)


  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors
  
  return (
    <div>
      <h2>Authors</h2>
      <Table striped bordered hover variant='light'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {props.token && (
        <AuthorBirthYear authors={authors} setNotification={props.setNotification} />
      )}
    </div>
  );
}

export default Authors
