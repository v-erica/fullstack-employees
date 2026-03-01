import request from "supertest";
import { describe, expect, it, test, vi } from "vitest";

import app from "#app";
import db from "#db/client";

/** Mock the database client to test just the API */
vi.mock("#db/client", () => ({
  default: { query: vi.fn() },
}));

const mockEmployee = {
  id: 1,
  name: "Mock Employee",
  birthday: "1001-10-01",
  salary: 100001,
};

test('GET / sends the message "Welcome to the Fullstack Employees API."', async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Welcome to the Fullstack Employees API.");
});

test("GET /employees sends all employees", async () => {
  db.query.mockResolvedValue({ rows: [mockEmployee, mockEmployee] });
  const response = await request(app).get("/employees");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([mockEmployee, mockEmployee]);
});

describe("POST /employees", () => {
  it("sends 400 if request has no body", async () => {
    const response = await request(app).post("/employees");
    expect(response.status).toBe(400);
  });

  it("sends 400 if request body does not have required fields", async () => {
    const response = await request(app).post("/employees").send({});
    expect(response.status).toBe(400);
  });

  it("creates a employee and sends it with status 201", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).post("/employees").send(mockEmployee);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockEmployee);
  });
});

describe("GET /employees/:id", () => {
  it("sends 404 if employee does not exist", async () => {
    db.query.mockResolvedValue({ rows: [] });
    const response = await request(app).get("/employees/0");
    expect(response.status).toBe(404);
  });

  it("sends the employee if it exists", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).get("/employees/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEmployee);
  });
});

describe("DELETE /employees/:id", () => {
  it("sends 404 if employee does not exist", async () => {
    db.query.mockResolvedValue({ rows: [] });
    const response = await request(app).delete("/employees/0");
    expect(response.status).toBe(404);
  });

  it("deletes the employee and sends 204", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).delete("/employees/1");
    expect(response.status).toBe(204);
  });
});

describe("PUT /employees/:id", () => {
  it("sends 400 if request has no body", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).put("/employees/1");
    expect(response.status).toBe(400);
  });

  it("sends 400 if request body does not have required fields", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).put("/employees/1").send({});
    expect(response.status).toBe(400);
  });

  it("sends 404 if employee does not exist", async () => {
    db.query.mockResolvedValue({ rows: [] });
    const response = await request(app).put("/employees/0").send(mockEmployee);
    expect(response.status).toBe(404);
  });

  it("updates and sends the employee", async () => {
    db.query.mockResolvedValue({ rows: [mockEmployee] });
    const response = await request(app).put("/employees/1").send(mockEmployee);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEmployee);
  });
});
