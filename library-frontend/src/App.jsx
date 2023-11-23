import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import {useApolloClient} from '@apollo/client'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <button onClick={() => setPage('add')}>add book</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
      <NewBook show={page === 'add'} setPage={setPage} />
    </div>
  )
}

export default App
