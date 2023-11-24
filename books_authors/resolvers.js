const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filteredBooks = await Book.find({})
      if (Object.keys(args).length === 0) {
        return filteredBooks
      }
      if (args.hasOwnProperty('author')) {
        const author = await Author.findOne({ name: args.author })
        filteredBooks = filteredBooks.filter(
          book => book.author.toString() === author._id.toString()
        )
      }
      if (args.hasOwnProperty('genre')) {
        filteredBooks = filteredBooks.filter(book =>
          book.genres.includes(args.genre)
        )
      }
      return filteredBooks
    },
    allAuthors: async (root, args) => Author.find({}),
    me: (root, args, { currentUser }) => {
      return currentUser
    },
  },
  Book: {
    author: async root => {
      const author = await Author.findById(root.author)
      return author
    },
  },
  Author: {
    bookCount: async root => {
      const author = await Author.findOne({ name: root.name })
      const authorBooks = await Book.find({
        author: author,
      })
      return authorBooks.length
    },
  },
  Mutation: {
    addBook: async (roots, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.author })
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (!author) {
        if (args.author.length < 3) {
          throw new GraphQLError(
            "Author's name should be at least 3 characters",
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
              },
            }
          )
        }
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
        args.author = newAuthor
      } else {
        args.author = author
      }
      const book = new Book({ ...args })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Please check all categories', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Unable to update', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return author
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      return user.save().catch(error => {
        throw new GraphQLError('Creating a new user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers