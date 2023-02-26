import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

const AuthorsDropdown = ({ setName }) => {
  const authors = useQuery(ALL_AUTHORS)

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <select onChange={handleNameChange}>
        {authors.data.allAuthors.map(author => (
          <option key={author.name} value={author.name}>{author.name}</option>
        ))}
      </select>
    </div>

  )
}

export default AuthorsDropdown
