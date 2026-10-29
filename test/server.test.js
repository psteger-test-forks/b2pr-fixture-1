// Starts the service on a free localhost port and tests it over HTTP.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";

let server, base;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const post = (path, body) =>
  fetch(base + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("health check", async () => {
  const res = await fetch(base + "/health");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("creates and lists ideas", async () => {
  const created = await post("/ideas", { title: "  Dark mode  " });
  assert.equal(created.status, 201);
  const idea = await created.json();
  assert.equal(idea.title, "Dark mode");
  const list = await (await fetch(base + "/ideas")).json();
  assert.ok(list.some((i) => i.id === idea.id && i.title === "Dark mode"));
});

test("rejects a missing, blank or overlong title", async () => {
  for (const body of [{}, { title: "   " }, { title: "x".repeat(121) }]) {
    assert.equal((await post("/ideas", body)).status, 400);
  }
});

test("unknown routes return 404", async () => {
  assert.equal((await fetch(base + "/nope")).status, 404);
});
