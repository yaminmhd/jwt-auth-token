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

let jwtToken;
let password;

const loginAsTom = async (password, agent) => {
  let email = fixtures.users.tom.email;
  let response = await agent
    .post("/api/user/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(status.OK);
};

test("Change password on the current user", async () => {
  const agent = request.agent(app);
  await loginAsTom(fixtures.users.tom.password, agent);

  const newPassword = "new-password";

  const updatedUser = {
    password: newPassword
  };

  let response = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser });

  expect(response.statusCode).toBe(status.OK);
  const agent2 = request(app);
  await loginAsTom(newPassword, agent2);
  password = newPassword;
});

test("Change password without login will result in unathorized error", async () => {
  const newPassword = "new-password";

  const updatedUser = {
    password: newPassword
  };

  let response = await request(app)
    .put("/api/user/change_password")
    .send({ user: updatedUser });

  expect(response.statusCode).toBe(status.UNAUTHORIZED);
});

test("change password with less than 8 characters will result in unprocessable entity error", async () => {
  const agent = request.agent(app);
  await loginAsTom(password, agent);
  const newPassword = "1234567";

  const updatedUser = {
    password: newPassword
  };

  let response = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser })
    .set("Authorization", "Bearer " + jwtToken);

  expect(response.statusCode).toBe(status.UNPROCESSABLE_ENTITY);
  expect(response.body.error.message).toEqual(
    "Password needs to be 8 character and higher"
  );
});
