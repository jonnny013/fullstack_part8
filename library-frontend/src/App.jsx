import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import {useApolloClient, useSubscription} from '@apollo/client'
import Notification from './components/Notification'
import { ALL_BOOKS, BOOK_ADDED} from './queries'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

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
    setPage('authors')
  }

  return (
    <div style={{margin: 10}}>
      <Notification info={notification} setNotification={setNotification} />
      <div style={{margin: 10, display: 'flex', gap: 10, overflow: 'scroll'}}>
        <Button variant='secondary' onClick={() => setPage('authors')}>
          Authors
        </Button>
        {'  '}
        <Button variant='secondary' onClick={() => setPage('books')}>
          Books
        </Button>
        {'  '}
        {token ? (
          <Button variant='secondary' onClick={() => setPage('add')}>
            Add book
          </Button>
        ) : (
          <Button variant='secondary' onClick={() => setPage('login')}>
            Login
          </Button>
        )}{' '}
        {token && (
          <Button variant='secondary' onClick={() => setPage('recommendations')}>
            Recommendations
          </Button>
        )}
        {'  '}
        {token && (
          <Button variant='secondary' onClick={logout}>
            Logout
          </Button>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
        setNotification={setNotification}
      />
      <Books show={page === 'books'} />
      <Recommendations show={page === 'recommendations'} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        setNotification={setNotification}
      />
      <NewBook
        show={page === 'add'}
        setPage={setPage}
        setNotification={setNotification}
      />
    </div>
  );
}

export default App
