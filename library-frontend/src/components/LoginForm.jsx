import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import NewUser from './NewUser'

const LoginForm = ({  setToken, show, setPage, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUser, setNewUser] = useState(false)

  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      setNotification(error.graphQLErrors[0].message)
    },
    onCompleted: () => {
      setNotification(`Welcome ${username}`)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('authors')
      setPassword('')
      setUsername('')
    }
  }, [result.data])

  const newUserLogin = (newUsername, newPassword) => {
    login({ variables: { username: newUsername, password: newPassword}})
  }

  const submit = async event => {
    event.preventDefault()

    login({ variables: { username, password } })
  }



  if (!show) {
    return null
  }

  if (newUser) {
    return (
      <NewUser setNewUser={setNewUser} newUser={newUser} setNotification={setNotification} login={newUserLogin} />
    )
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
        <button type='button' onClick={() => setNewUser(!newUser)}>New User</button>
      </form>
    </div>
  )
}

export default LoginForm
