require("dotenv").config();
const { DATA_BASE } = require("./database/mongo/index");
const { APP_CONFIG } = require("./config/db");
const NodeJSTest = require("./index");


(async function () {
  // connecting to database
  await DATA_BASE.connectDatabase(() => {
    console.log("App database has connected successfully");
    NodeJSTest.listen(APP_CONFIG.HTTP_PORT, "0.0.0.0", () => {
      console.log(`App is up and running on port ${APP_CONFIG.HTTP_PORT}`);
    });
  });
})();
