import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTH_YEAR } from '../queries'

const AuthorBirthYear = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [ changeYear, result ] = useMutation(EDIT_BIRTH_YEAR)

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log('person not found')
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault() 
    
    changeYear({ variables: {name, born }})

    setBorn('')
    setName('')
  }
console.log(name)
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