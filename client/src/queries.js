import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author
    published
  }
}
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      id
      genres
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name
      id
      born
      bookCount
    }
  }
`
