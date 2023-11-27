import { useQuery } from '@apollo/client'
import { ALL_BOOKS, USER_INFO } from '../queries'
import { useState } from 'react'
import { useEffect } from 'react'

const Recommendations = props => {
  const [genre, setGenre] = useState(undefined)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const userResult = useQuery(USER_INFO)

  useEffect(() => {
    if (userResult.data) {
      if (userResult.data.me){
        setGenre(userResult.data.me.favoriteGenre)
      }
      
    }
  }, [userResult.data])
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks
  
  return (
    <div>
      <h2>Recommended for you</h2>
      {genre && (
        <p>
          Showing your favorite genre: <b>{genre}</b>
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
    </div>
  )
}

export default Recommendations
