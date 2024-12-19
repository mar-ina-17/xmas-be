const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const filePath = path.join("db.json");
const middlewares = jsonServer.defaults();
// Load the current database
let db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Middleware to replace the /people data
server.post("/people", (req, res) => {
  try {
    // Overwrite the people array with new data
    db.people = req.body;

    // Save the updated database back to the file
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

    res.status(200).send("People data replaced successfully");
  } catch (err) {
    console.error("Error updating people:", err);
    res.status(500).send("Failed to update people data");
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
