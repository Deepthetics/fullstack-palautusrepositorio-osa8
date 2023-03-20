const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

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
    allAuthors: async () => {
      return Author.find({})
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
      //return Book.countDocuments({ author: root._id })
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null })

        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
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
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      let authorOfAddedBook = await Author.findOne({ name: args.author })
      authorOfAddedBook.books = authorOfAddedBook.books.concat(newBook._id)
      try {
        await authorOfAddedBook.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error 
          }
        })
      }
      
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
      return newBook
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
    },
    createUser: async (root, args) => {
      const newUser = new User({ ...args })

      try {
        return await newUser.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers
