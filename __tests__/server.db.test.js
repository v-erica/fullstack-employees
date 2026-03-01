import { afterAll, beforeAll, describe, expect, test } from "vitest";

import db from "#db/client";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";

beforeAll(async () => {
  await db.connect();
  await db.query("BEGIN");
});
afterAll(async () => {
  await db.query("ROLLBACK");
  await db.end();
});

describe('"employees" queries', () => {
  let createdEmployee;

  test("getEmployees() returns the array of employees", async () => {
    const { rows: expected } = await db.query("SELECT * FROM employees");
    const result = await getEmployees();
    expect(result).toEqual(expected);
  });

  test("createEmployee() creates and returns a new employee", async () => {
    const employee = {
      name: "New employee",
      birthday: "1001-10-01",
      salary: 100001,
    };
    const result = await createEmployee(employee);
    createdEmployee = result;
    expect(result).toEqual(
      expect.objectContaining({
        name: employee.name,
        birthday: expect.any(Date),
        salary: employee.salary,
      }),
    );
  });

  test("getEmployee() returns the employee with the given id", async () => {
    const {
      rows: [expected],
    } = await db.query("SELECT * FROM employees WHERE id = $1", [
      createdEmployee.id,
    ]);
    const result = await getEmployee(createdEmployee.id);
    expect(result).toEqual(expected);
  });

  test("updateEmployee() updates and returns the employee", async () => {
    const employee = {
      id: createdEmployee.id,
      name: "updated employee",
      birthday: "1001-10-01",
      salary: 100001,
    };
    const result = await updateEmployee(employee);
    expect(result).toEqual(
      expect.objectContaining({
        name: employee.name,
        birthday: expect.any(Date),
        salary: employee.salary,
      }),
    );
  });

  test("deleteEmployee() deletes the employee", async () => {
    await deleteEmployee(createdEmployee.id);
    const { rows } = await db.query("SELECT * FROM employees WHERE id = $1", [
      createdEmployee.id,
    ]);
    expect(rows.length).toBe(0);
  });
});
