import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createClient } from './books-grpc-client.js';
import grpc from '@grpc/grpc-js';
import { bookData } from './book-data.js';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed
// against your data.
const typeDefs = `#graphql
    # comments in GraphQL start with a #

    # this Book type defines the queryable fields for every Book in our data source
    type Book {
        title: String
        author: String
    }

    # the Query type is special: it lists all of the available queries that
    # clients can execute, along with the return types of each.
    type Query {
        # the "books" query returns an array of zero or more Books when filtered by a partial title.
        listBooks(title: String!): [Book]
    }
`;

const booksGrpcClient = createClient('0.0.0.0:50051', grpc.credentials.createInsecure());

const resolvers = {
    Query: {
        async listBooks(parent, args, contextValue, info) {
            if (contextValue['x-implementation'] === 'grpc') {
                // call the gRPC service
                const b = await booksGrpcClient.listBooks({title: args.title}) as any;
                return b.books;
            }
            else if (contextValue['x-implementation'] === 'local') {
                // use the "local" implementation.  This is totally unrealistic, but
                // useful to demonstrate the lowest theoretical latency possible for the
                // Apollo server implementation.
                return bookData.filter(b => b.title.includes(args.title));                
            }
            else {
                throw new Error('Not supported x-implementation header');
            }
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        return { 'x-implementation': req.headers['x-implementation'] };
    }
});

console.log(`🚀  Server ready at: ${url}`);
