import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTH_YEAR } from '../queries'

const AuthorBirthYear = ({ authors, setNotification }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [changeYear, result] = useMutation(EDIT_BIRTH_YEAR, {
    onError: error => {
      setNotification(error.graphQLErrors.map(e => e.message).join('\n'))
    },
    onCompleted: () => {
      setNotification(`Birth year updated`)
    },
  })

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setNotification('person not found')
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault() 
    
    changeYear({ variables: {name, born }})

    setBorn('')
    setName('')
  }
  return (
    <>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          <select
            defaultValue='Choose an author'
            onChange={({ target }) => setName(target.value)}
          >
            <option disabled>Choose an author</option>
            {authors.map(a => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Birth year
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>Update</button>
      </form>
    </>
  )

}



export default AuthorBirthYear