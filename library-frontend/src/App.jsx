import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import {useApolloClient, useSubscription} from '@apollo/client'
import Notification from './components/Notification'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = a => {
    let seen = new Set()
    return a.filter(item => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const [notification, setNotification] = useState(null)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      setNotification(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setNotification('See you next time!')
  }

  return (
    <div>
      <Notification info={notification} setNotification={setNotification} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <button onClick={() => setPage('add')}>add book</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
        {token && (
          <button onClick={() => setPage('recommendations')}>
            recommendations
          </button>
        )}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} token={token} setNotification={setNotification} />
      <Books show={page === 'books'} />
      <Recommendations show={page === 'recommendations'} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        setNotification={setNotification}
      />
      <NewBook show={page === 'add'} setPage={setPage} setNotification={setNotification} />
    </div>
  )
}

export default App
