import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import _ from 'underscore'
import { useState } from 'react'

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
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredGenres.map(a => (
        <button key={a} onClick={() => genres(a)}>
          {a}
        </button>
      ))}
      <button onClick={() => genres(undefined)}>All genres</button>
    </div>
  )
}

export default Books
