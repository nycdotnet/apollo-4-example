import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader'
import { promisifyClient } from './promisify-grpc-client.js';

const booksProtoPath = new URL('../protos/books.proto', import.meta.url).pathname

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

export function createClient(binding: string, credentials: grpc.ChannelCredentials) {
    return promisifyClient(new booksProto.Books(binding, credentials));
}