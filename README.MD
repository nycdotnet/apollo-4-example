Apollo 4 Example
================

This gives an example of how to write a GraphQL server using the official Apollo examples and the resolvers docs.

https://www.apollographql.com/docs/apollo-server/getting-started

https://www.apollographql.com/docs/apollo-server/data/resolvers

To get started, download the source and run `npm install`.

Includes a benchmark script using [k6](https://k6.io/docs/using-k6/).

To start the GraphQL server, run `npm run start`.

To start the backing gRPC server, run `npm run start-books-grpc`.

Once both servers are launched, run benchmarks via `k6 run loadtest.js`.

Original Non-gRPC version:
On my laptop, the original non-gRPC enabled GraphQL server can handle 5118 requests/second with 100 virtual users at 18.96 ms median latency/ 23.28 ms p95 latency with no special configuration (single threaded Node.js launched via `npm run start`, Windows 10 x64, Node.js 18).  The server pegs a CPU while it's getting load tested, but then settles back down to zero when the test ends.  It holds steady at about 120 MB working set while busy and then settles down at around 25 MB while idle.

The gRPC version can handle 2081 requests/second with 100 virtual users at 46.76 ms median latency/56.23 ms p95.  The GraphQL server saturates a CPU and the gRPC server uses a little under half a core (guestimate from Task Manager).
