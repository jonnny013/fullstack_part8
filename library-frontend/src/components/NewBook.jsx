import { useState } from 'react'
import {useMutation} from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'
import { updateCache } from '../App'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const NewBook = props => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, 'getAllBooks'],
    onError: error => {
      props.setNotification(error.graphQLErrors.map(e => e.message).join('\n'))
      console.log(error)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    },
  }) 

  const submit = async event => {
    event.preventDefault()

    createBook({ variables: { title, author, published, genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    props.setPage('books')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <Form onSubmit={submit}>
        <div>
          <Form.Label>Book Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter title'
            value={title}
            onChange={({target}) => setTitle(target.value)}
          />
        </div>
        <div>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter author'
            value={author}
            onChange={({target}) => setAuthor(target.value)}
          />
        </div>
        <div>
          <Form.Label>Year Published</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter year'
            value={published}
            onChange={({target}) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <Form.Label>Genre(s)</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter genres'
            value={genre}
            onChange={({target}) => setGenre(target.value)}
          />
          <Button onClick={addGenre} type='button'>
            Add genre
          </Button>
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <br />
        <Button type='submit'>Create book</Button>
      </Form>
    </div>
  );
}

export default NewBook
