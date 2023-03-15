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
      author {
        name
      }
      published
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
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

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql `
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
