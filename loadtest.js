import http from 'k6/http';
import { check } from 'k6';

const useGrpcBooksService = {
  exec: 'searchGrpc',
  vus: 100,
  executor: 'constant-vus',
  duration: '30s'
};

const useLocalImplementation = {
  exec: 'searchLocal',
  vus: 100,
  executor: 'constant-vus',
  duration: '30s'
};

export const options = {
  scenarios: {}
};

if (__ENV.SCENARIO === 'LOCAL') {
  options.scenarios['use-local'] = useLocalImplementation;
}
else if (__ENV.SCENARIO === 'GRPC' || !__ENV.SCENARIO) {
  options.scenarios['use-grpc'] = useGrpcBooksService;
}
else {
  throw new Error('Must specify -e SCENARIO=LOCAL or -e SCENARIO=GRPC.');
}


const booksQueryBase = {
  operationName: 'GetBooks',
  query: "query GetBooks($title: String!) { listBooks(title: $title) { author title } }",
};

const defaultHeaders = { 'Content-Type': 'application/json' };

export function searchGrpc() {
    searchI('grpc');
    searchZ('grpc');
    searchGlass('grpc');
}

export function searchLocal() {
  searchI('local');
  searchZ('local');
  searchGlass('local');
}

export function searchI(implementation) {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'i' }}, booksQueryBase)),
    { headers: Object.assign({ 'x-implementation': implementation }, defaultHeaders) });

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had two books': r => r.data.listBooks.length === 2 });
}

export function searchGlass(implementation) {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'Glass' }}, booksQueryBase)),
    { headers: Object.assign({ 'x-implementation': implementation }, defaultHeaders) });

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had expected book': r => r.data.listBooks.length === 1 && r.data.listBooks[0].title === 'City of Glass' && r.data.listBooks[0].author === 'Paul Auster' });
}

export function searchZ(implementation) {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'z' }}, booksQueryBase)),
    { headers: Object.assign({ 'x-implementation': implementation }, defaultHeaders) });

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had no books': r => r.data.listBooks.length === 0 });
}
