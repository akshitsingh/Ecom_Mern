const app = require("./app");
const PORT = "4000";

const dotenv = require("dotenv");
const connectedDatabase = require("./config/database");

//Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server due to unhandled rejection");
  process.exit(1);
});


dotenv.config({ path: __dirname + "/config/config.env" });

connectedDatabase();

const server = app.listen(PORT, () => {
  console.log(PORT);
});

//Unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});
