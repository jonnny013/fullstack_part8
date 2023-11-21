import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTH_YEAR } from '../queries'

const AuthorBirthYear = () => {
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

  return (
    <>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          Author&apos;s name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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