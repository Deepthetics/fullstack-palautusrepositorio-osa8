import NewBirthyear from './NewBirthyear'

const Authors = ({ show, authors }) => {
  if (!show) {
    return null
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <NewBirthyear />
    </div>
  )
}

export default Authors
