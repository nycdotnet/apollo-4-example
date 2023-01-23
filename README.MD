Apollo 4 Example
================

This gives an example of how to write a GraphQL server using the official Apollo examples and the resolvers docs.

https://www.apollographql.com/docs/apollo-server/getting-started

https://www.apollographql.com/docs/apollo-server/data/resolvers

To get started, download the source and run `npm install`.

Includes a benchmark script using [k6](https://k6.io/docs/using-k6/).

To start the server, run `npm run start`.

Once the app is launched, run benchmarks via `k6 run loadtest.js`.

On my laptop, this GraphQL server can handle about 5000 requests/second at 39.2 ms median latency/ 48 ms p95 latency with no special configuration (single threaded Node.js launched via `npm run start`, Windows 10 x64, Node.js 18).  The server pegs a CPU while it's getting load tested, but then settles back down to zero when the test ends.  It holds steady at about 120 MB working set while busy and then settles down at around 25 MB while idle.
