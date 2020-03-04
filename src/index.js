const { ApolloServer, gql, PubSub } = require('apollo-server')

// query = SELECT
// mutation = INSERT, UPDATE, DELETE

// The GraphQL schema
const typeDefs = gql`
    type Query {
        hello(name: String): String!
        user: User
    }

    type User {
        id: ID!
        username: String
        firstLetterOfUsername: String
    }

    type Error {
        field: String!
        message: String!
    }

    type RegisterResponse {
        user: User
        errors: [Error!]
    }

    input UserInfo {
        username: String!,
        password: String!
    }

    type Mutation {
        register(userInfo: UserInfo, age: Int): RegisterResponse!
        login(userInfo: UserInfo): String!
    }

    type Subscription {
        newUser: User!
    }
`

const NEW_USER = `NEW_USER`

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        hello: (parent, { name }) => `Hello ${name || `World`}!`,
        user: () => ({
            id: 1,
            username: `aaronconway7`
        })
    },
    Mutation: {
        register: (parent, { userInfo: { username } }, { pubsub } ) => {
            const user = {
                id: 1,
                username
            }

            pubsub.publish(NEW_USER, {
                newUser: user
            })
            return {
                user,
                errors: [
                    {
                        field: `username`,
                        message: `username already taken`
                    }
                ]
            }
        },
        login: async (parent, { userInfo: { username, password } }, context, info) => {
            // Check the password
            // await checkPassword(password)
            return username
        }
    },
    User: {
        firstLetterOfUsername: (parent) => {
            return parent.username ? parent.username[0] : null
        }
    },
    Subscription: {
        newUser: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
        }
    }
}

const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, pubsub })
})

server.listen().then(({url}) => console.log(`Server started at ${url}`))