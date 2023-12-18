import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTH_YEAR } from '../queries'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


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
      <Form onSubmit={submit}>
        <div>
          <Form.Select
            defaultValue='Choose an author'
            onChange={({target}) => setName(target.value)}
          >
            <option disabled>Choose an author</option>
            {authors.map(a => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <div>
          <Form.Label>Birth Year</Form.Label>
          <Form.Control
            placeholder='Enter year'
            value={born}
            onChange={({target}) => setBorn(Number(target.value))}
          />
        </div>
        <br />
        <Button type='submit' variant='secondary'>Update</Button>
      </Form>
    </>
  );

}



export default AuthorBirthYear