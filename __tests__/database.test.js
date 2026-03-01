import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

import db from "#db/client";

beforeAll(async () => {
  await db.connect();
  await db.query("BEGIN");
});
afterAll(async () => {
  await db.query("ROLLBACK");
  await db.end();
});

describe('"employees" table', () => {
  it("is created", async () => {
    const sql = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name = 'employees'
    `;
    const { rows } = await db.query(sql);
    expect(rows.length).toBe(1);
  });

  describe("columns", () => {
    let columns;

    beforeAll(async () => {
      const sql = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'employees'
      `;
      const { rows } = await db.query(sql);
      columns = rows;
    });

    test('"id" exists, is type serial, and is not nullable', () => {
      const id = columns.find((column) => column.column_name === "id");
      expect(id).toBeDefined();
      expect(id.data_type).toBe("integer");
      expect(id.column_default.startsWith("nextval")).toBe(true);
      expect(id.is_nullable).toBe("NO");
    });

    test('"name" exists, is type text, and is not nullable', () => {
      const name = columns.find((column) => column.column_name === "name");
      expect(name).toBeDefined();
      expect(name.data_type).toBe("text");
      expect(name.is_nullable).toBe("NO");
    });

    test('"birthday" exists, is type date, and is not nullable', () => {
      const release = columns.find(
        (column) => column.column_name === "birthday",
      );
      expect(release).toBeDefined();
      expect(release.data_type).toBe("date");
      expect(release.is_nullable).toBe("NO");
    });

    test('"salary" exists, is type integer, and is not nullable', () => {
      const running = columns.find((column) => column.column_name === "salary");
      expect(running).toBeDefined();
      expect(running.data_type).toBe("integer");
      expect(running.is_nullable).toBe("NO");
    });
  });

  it("is seeded with at least 10 employees", async () => {
    const sql = "SELECT * FROM employees";
    const { rows } = await db.query(sql);
    expect(rows.length).toBeGreaterThanOrEqual(10);
  });
});
