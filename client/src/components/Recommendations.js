import { useQuery } from '@apollo/client'
import { FAVORITE_GENRE } from '../queries'

const Recommendations = ({ show, books }) => {
  const favoriteGenre = useQuery(FAVORITE_GENRE)

  if (!show) {
    return null
  }

  if (books.loading || favoriteGenre.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre <b>{favoriteGenre.data.me.favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.filter((b) => b.genres.includes(favoriteGenre.data.me.favoriteGenre)).map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
