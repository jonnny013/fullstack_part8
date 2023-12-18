import { useState, useEffect } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';

const NewUser = ({ setNewUser, newUser, setNotification, login, setShowLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [genre, setGenre] = useState('')

  const [createUser, result] = useMutation(CREATE_USER, {
    onError: error => {
      setNotification(error.graphQLErrors[0].message)
    }, 
    onCompleted: () => {
      setNotification(`User "${username}" create `)
      login(username, password)
    }
  })

  useEffect(() => {
    if (result.data) {
      setPassword('')
      setUsername('')
      setGenre('')
    }
  }, [result.data])

  const onFormSubmit = async (event) => {
    event.preventDefault()
    createUser({variables: { password, username, favoriteGenre: genre }}) 
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
              <CloseButton  onClick={() => setShowLogin(false)} />
      <Form onSubmit={onFormSubmit}>
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
        <div>
          <Form.Label>Favorite Genre</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter username'
            value={genre}
            onChange={({target}) => setGenre(target.value)}
          />
        </div>
        <div style={{margin: 10, display: 'flex', gap: 10}}>
          <Button variant='secondary' type='submit'>
            Create User
          </Button>
          <Button variant='secondary' type='button' onClick={() => setNewUser(!newUser)}>
            Login
          </Button>
        </div>
      </Form>
      </div>
    </div>
  );
}

export default NewUser