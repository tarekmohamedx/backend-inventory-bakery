

const cors = require("cors"); 
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middlewares
app.use(morgan("common"));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false,
    preserveExtension: true,
  })
);

// controller registrations
const controllersDirPath = path.join(__dirname, "controllers");
const controllersDirectory = fs.readdirSync(controllersDirPath);

for (const controllerFile of controllersDirectory) {
  const controller = require(path.join(controllersDirPath, controllerFile)); // dynamic and load files sync
  // app.use(controller);
  if (controller && typeof controller === "function") {
    app.use(controller);
  } else {
    console.error(`Invalid controller: ${controllerFile}`);
  }
}

// export point
module.exports = app;