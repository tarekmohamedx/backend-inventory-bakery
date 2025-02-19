const cors = require("cors"); 
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const cartRouter = require('./routes/cart.route');
const session = require("express-session");

const cartController = require('./controllers/cart.controller')
const adminController = require('./controllers/admin.controller')
const sellerRouter =require("./controllers/seller.controller.js");
InventoryController = require('./controllers/inventory.controller')

const app = express();
app.use(cors({
  origin: "http://localhost:4200", // Adjust this to match your frontend URL
  credentials: true, // ✅ Allow cookies/session sharing between frontend & backend
}));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middlewares
app.use(morgan("common"));

const bodyParser = require("body-parser");

// Increase JSON body limit
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));


app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 },
    tempFileDir: "/tmp/",
    useTempFiles: false,
    preserveExtension: true,
  })
);



// ✅ Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || '1a4f293648fac623dff0678b30f9f142', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

app.get('/check-session', (req, res) => {
  if (req.session.token) {
    res.json({ sessionToken: req.session.token });
  } else {
    res.status(401).json({ message: "No token in session" });
  }
});

app.use('/cart', cartController);


//routing
app.use('/api/cart', cartController);
app.use('/api/admin', adminController);

app.use('/api/seller', sellerRouter); 



app.use('/api/seller', sellerRouter);
app.use('/api/inventory', InventoryController);

// const profileRouter = require('./controllers/userprofile1.controller.js');

// Mount profile routes under /api/users
// app.use('/api/users', profileRouter);


const userProfileRoutes = require('./routes/UserProfile1.route.js');
app.use('/api', userProfileRoutes);


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
//export default app;