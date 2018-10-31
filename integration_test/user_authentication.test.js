process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../src/app");
const status = require("http-status");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);
afterAll(testDB.teardown);

describe("User authentication", () => {
  test("User login successfully", async () => {
    let email = fixtures.users.tom.email;
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    let userJson = response.body.user;
    expect(response.statusCode).toBe(status.OK);
    expect(userJson).toBeDefined();
    expect(userJson.email).toEqual(email);
    const jwtTokenCookie = [expect.stringMatching(/jwt/)];
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining(jwtTokenCookie)
    );
  });

  test("Login with invalid email", async () => {
    let email = "bogus@example.com";
    let password = "bogus";
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    expect(response.statusCode).toBe(status.UNAUTHORIZED);
    let responseErrors = response.body.error.message;
    expect(responseErrors).toEqual("email or password is invalid");
  });

  test("Login with invalid password", async () => {
    let email = fixtures.users.tom.email;
    let password = "bogus";
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    expect(response.statusCode).toBe(status.UNAUTHORIZED);
    let responseErrors = response.body.error.message;
    expect(responseErrors).toEqual("email or password is invalid");
  });

  test("Login with empty username", async () => {
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { password } });

    expect(response.statusCode).toBe(status.UNAUTHORIZED);
    let responseErrors = response.body.error.message;
    expect(responseErrors).toEqual("email or password is invalid");
  });
});
