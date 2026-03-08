import db from "#db/client";
import { createEmployee } from "#db/queries/employees";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  for (let i = 0; i < 15; i++) {
    const employee = {
      name: "Employee " + i,
      birthday: "1990-04-11",
      salary: Math.floor(Math.random() * 200000),
    };
    await createEmployee(employee);
  }
}
