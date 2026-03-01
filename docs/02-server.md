# Server

In this section, you can test your work as you go along with `npm run test:server`.

## Complete the queries

Complete the rest of the queries in `db/queries/employees`.

## Write the Express routes

Now that your database is up and running, build the rest of your server to serve the
following routes. Remember to use the appropriate body-parsing and error-handling
middleware!

- `GET /` sends the message "Welcome to the Fullstack Employees API."
- `GET /employees` sends array of all employees
- `POST /employees`
  - Sends 400 if request body is not provided
  - Sends 400 if request body is missing a required field
  - Sends the newly created employee with status 201
- `GET /employees/:id`
  - Sends 404 if employee does not exist
  - Sends employee with specified ID
- `DELETE /employees/:id`
  - Sends 404 if employee does not exist
  - Deletes the specified employee and sends status 204
- `PUT /employees/:id` updates employee with specified ID with provided data
  - Sends 400 if request body is not provided
  - Sends 400 if request body is missing a required field
  - Sends 404 if employee does not exist
  - Updates and sends the employee with status 200

If you've done everything correctly, you should now pass all test cases when you run `npm run
test`.
