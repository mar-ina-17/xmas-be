const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const filePath = path.join("db.json");
const middlewares = jsonServer.defaults();
// Load the current database
let db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Middleware to replace the /people data
server.delete("/people/:name", (req, res) => {
  try {
    const { name } = req.params;
    db.people = db.people.filter((person) => person.name !== name);

    // Save the updated database back to the file
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

    res.status(200).send(`Person with name ${name} deleted successfully`);
  } catch (err) {
    console.error("Error deleting person:", err);
    res.status(500).send("Failed to delete person");
  }
});

// Comment out to allow write operations
const router = jsonServer.router(db);

server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
