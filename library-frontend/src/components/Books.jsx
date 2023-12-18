import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import _ from 'underscore'
import { useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


const Books = props => {
  const [genre, setGenre] = useState(undefined)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  }) 

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks
  const allGenres = books.map(a => a.genres).flat()
  const filteredGenres = _.uniq(allGenres, false)

  const genres = (name) => {
    setGenre(name)
  }
  return (
    <div>
      <h2>Books</h2>
      {genre && (
        <p>
          Showing genre: <b>{genre}</b>
        </p>
      )}
      <Table striped bordered hover variant='light'>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{margin: 10, display: 'flex', gap: 10, overflow: 'scroll'}}>
        {filteredGenres.map(a => (
          <Button variant='light' key={a} onClick={() => genres(a)}>
            {a}
          </Button>
        ))}
        <Button variant='secondary' onClick={() => genres(undefined)}>
          All genres
        </Button>
      </div>
    </div>
  );
}

export default Books
