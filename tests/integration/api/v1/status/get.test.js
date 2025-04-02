test("GET a /api/v1/status debe retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdated = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdated);

  expect(responseBody.dependencies.database.version).toEqual("15.12");
  expect(responseBody.dependencies.database.max_connections).toEqual(901);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
