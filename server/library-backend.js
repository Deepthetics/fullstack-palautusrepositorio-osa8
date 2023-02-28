const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')
//const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(name: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.name && args.genre) {
        const booksByGenre = await Book.find({ genres: { $in: [args.genre] } }).populate('author')
        return booksByGenre.filter(book => book.author.name === args.name)
      }
      if (args.name) {
        const books = await Book.find({}).populate('author')
        return books.filter(book => book.author.name === args.name)
      }
      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id })
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null })

        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      }

      const newBook = new Book({ ...args, author: author })
      
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            invalidArgs: args.name,
            error
          }
        })
      }
      return newBook
    },
    editAuthor: async (root, args) => {
      return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
