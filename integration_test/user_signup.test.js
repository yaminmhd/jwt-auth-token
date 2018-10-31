process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const request = require("supertest");
const app = require("../src/app");
const status = require("http-status");

beforeAll(testDB.setup);
afterAll(testDB.teardown);

describe("New user signup", () => {
  test("Register a new user successfully", async () => {
    const username = "luke";
    const email = "luke@example.com";
    const password = "mypassword";

    let response = await request(app)
      .post("/api/user/signup")
      .send({ user: { username, email, password } });

    let userJson = response.body.user;

    expect(response.statusCode).toBe(status.OK);
    expect(userJson).toBeDefined();
    expect(userJson.username).toEqual(username);
    expect(userJson.email).toEqual(email);
  });

  test("Another user register with the same username will result in error", async () => {
    const username = "luke";
    const email = "luke@hotmail.com";
    const password = "newpassword";

    let response = await request(app)
      .post("/api/user/signup")
      .send({ user: { username, email, password } });

    expect(response.statusCode).toBe(status.INTERNAL_SERVER_ERROR);
    expect(response.body.error.message).toEqual(
      "User validation failed: username: should be unique"
    );
  });
});
