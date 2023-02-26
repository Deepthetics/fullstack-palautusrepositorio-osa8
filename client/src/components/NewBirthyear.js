import { useMutation } from '@apollo/client'
import { useState } from 'react'
import AuthorsDropdown from './AuthorsDropdown'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const NewBirthyear = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: born } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <AuthorsDropdown setName={setName} />
        </div>
        <div>
          birthyear
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>set birthyear</button>
      </form>
    </div>
    )
}

export default NewBirthyear
