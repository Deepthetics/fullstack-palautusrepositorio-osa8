import { useState } from "react"

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState(null)

  if (!show) {
    return null
  }

  if (books.loading) {
    return <div>loading...</div>
  }

  const genres = books.data.allBooks.reduce((acc, book) => {
    book.genres.forEach((genre) => {
      if (!acc.includes(genre)) {
        acc.push(genre)
      }
    })
    return acc
  }, [])

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filter
            ? books.data.allBooks.filter((b) => b.genres.includes(filter)).map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))
            : books.data.allBooks.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div>
        {genres.map(genre =>
          <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>)}
          <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
