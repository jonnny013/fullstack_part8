import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import NewUser from './NewUser'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
      <Form onSubmit={submit}>
        <div>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter username'
            value={username}
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <div style={{margin: 10, display: 'flex', gap: 10}}>
          <Button variant='secondary' type='submit'>
            Login
          </Button>
          <Button variant='secondary' type='button' onClick={() => setNewUser(!newUser)}>
            New User
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm
