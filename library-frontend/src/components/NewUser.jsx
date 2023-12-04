import { useState, useEffect } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'

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
      <form onSubmit={onFormSubmit}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          Favorite Genre
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
        </div>
        <button type='submit'>Create User</button>
        <button type='button' onClick={() => setNewUser(!newUser)}>
          Cancel
        </button>
      </form>
    </>
  )
}

export default NewUser