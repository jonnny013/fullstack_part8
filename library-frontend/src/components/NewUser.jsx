import { useState, useEffect } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const NewUser = ({ setNewUser, newUser, setNotification, login }) => {
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
    <>
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
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
}

export default NewUser