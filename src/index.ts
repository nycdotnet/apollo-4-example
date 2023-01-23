import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

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
        # the "books" query returns an array of zero or more Books.
        listBooks: [Book]
        # the "books" query returns an array of zero or more Books when filtered by a partial title.
        listBooksByTitle(title: String!): [Book]
    }
`;

const books : Book[] = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin'
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    }
];

let requests = 0;

const resolvers = {
    Query: {
        listBooks: () => books,
        listBooksByTitle(parent, args, contextValue, info) {
            requests++;
            if (requests % 500 === 0) {
                console.log(`The server has responded to ${requests} requests.`);
            }
            return books.filter(b => b.title.includes(args.title))
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
});

interface Book {
    title: string;
    author: string;
}

console.log(`🚀  Server ready at: ${url}`);
