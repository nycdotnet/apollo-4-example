Apollo 4 Example
================

This gives an example of how to write a GraphQL server using the official Apollo examples and the resolvers docs.

https://www.apollographql.com/docs/apollo-server/getting-started

https://www.apollographql.com/docs/apollo-server/data/resolvers

To get started, download the source and run `npm install`.

Includes a benchmark script using [k6](https://k6.io/docs/get-started/installation/).

To start the GraphQL server, run `npm run start`.

To start the backing gRPC server, run `npm run start-books-grpc`.

Once both servers are launched, run benchmarks via K6.

To test the gRPC implementation: `k6 run -e SCENARIO=GRPC loadtest.js`.

To test the "local" unrealistic implementation: `k6 run -e SCENARIO=LOCAL loadtest.js`.

### Local unrealistic implementation:
On my laptop, the unrealistic non-gRPC enabled GraphQL server can handle 3616 requests/second with 100 virtual users at 27.13 ms median latency/ 33.35 ms p95 latency with no special configuration (single threaded Node.js launched via `npm run start`, Windows 10 x64, Node.js 18).  The server pegs a CPU while it's getting load tested, but then settles back down to zero when the test ends.  It holds steady at about 120 MB working set while busy and then settles down at around 25 MB while idle.

### gRPC server called by GraphQL implementation:
On my laptop, the gRPC version can handle 2137 requests/second with 100 virtual users at 45.82 ms median latency/52.88 ms p95.  The GraphQL server saturates a CPU and the gRPC server uses a little under half a core (visual estimate from Task Manager).

