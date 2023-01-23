import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    search: {
      exec: 'search',
      vus: 100,
      executor: 'constant-vus',
      duration: '30s'
    }
  }
};

const booksQueryBase = {
  operationName: 'GetBooks',
  query: "query GetBooks($title: String!) { listBooksByTitle(title: $title) { author title } }",
};

const booksQueryParams = { headers: { 'Content-Type': 'application/json' } };

export function search() {
    searchI();
    searchZ();
    searchGlass();
}

export function searchI() {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'i' }}, booksQueryBase)),
    booksQueryParams);

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had two books': r => r.data.listBooksByTitle.length === 2 });
}

export function searchGlass() {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'Glass' }}, booksQueryBase)),
    booksQueryParams);

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had expected book': r => r.data.listBooksByTitle.length === 1 && r.data.listBooksByTitle[0].title === 'City of Glass' && r.data.listBooksByTitle[0].author === 'Paul Auster' });
}

export function searchZ() {
  const res = http.post("http://localhost:4000/",
    JSON.stringify(Object.assign({ variables: { title: 'z' }}, booksQueryBase)),
    booksQueryParams);

  check(res, { 'status was 200': r => r.status == 200 });
  check(JSON.parse(res.body), { 'had no books': r => r.data.listBooksByTitle.length === 0 });
}
