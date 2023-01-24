import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader'
import { fileURLToPath } from 'url';
import { bookData } from './book-data.js';

const booksProtoPath = fileURLToPath(new URL('../protos/books.proto', import.meta.url));

const booksPackageDefinition = protoLoader.loadSync(
    booksProtoPath,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const booksProto = (grpc.loadPackageDefinition(booksPackageDefinition) as any).apollo_example.books;

function listBooks(call, callback) {
    const response = {
        books: bookData.filter(b => b.title.includes(call.request.title))
    };
    callback(null, response);
}

const binding = '0.0.0.0:50051';

function main() {
    const server = new grpc.Server();
    server.addService(booksProto.Books.service, { listBooks: listBooks });
    server.bindAsync(binding, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`gRPC server listening on ${binding}`);
    });
}

main();