# b2pr-fixture-ideas

This is a tiny in-memory "ideas" web service with **no dependencies**, used as the Backlog2PR M0 gate 5 test project. It uses Node 22's built-in HTTP server, test runner and `fetch`, so it builds and tests at the runner's `none` network level: the tests start the service on a free `127.0.0.1` port and call it over HTTP.

```bash
npm test     # node --test
npm start    # serves on http://127.0.0.1:3000 (PORT overrides)
```

Endpoints:
- `GET /health`
- `GET /ideas`
- `POST /ideas {"title": "..."}`: the title must be 1–120 characters after trimming.
