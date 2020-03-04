const { ApolloServer, gql } = require('apollo-server')

// The GraphQL schema
const typeDefs = gql`
    type Query {
        hello: String!
    }
`

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        hello: () => `Hello World!`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => console.log(`Server started at ${url}`))