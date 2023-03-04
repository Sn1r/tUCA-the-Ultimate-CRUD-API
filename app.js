const bodyParser = require("body-parser");
const express = require("express");
const booksController = require("./controllers/booksController");
const authController = require("./controllers/authController");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const usersController = require("./controllers/usersController");
const mongoose = require("mongoose");
const { schema, root } = require("./services/GraphQLService");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

mongoose.set("strictQuery", false);

require("dotenv").config();

const corsOptions = {
  origin: "*",
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Using GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Connect to Mongo
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

/* Middlewares */
// Authorization
const authorize = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ success: false, msg: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).send({ success: false, msg: "Forbidden" });
  }
};

/* Routes */
// Book related
app.get("/api/v1/books", authorize, booksController.getAllBooks);
app.get("/api/v1/books/:id", authorize, booksController.getBookById);
app.post("/api/v1/books", authorize, booksController.createBook);
app.put("/api/v1/books/:id", authorize, booksController.updateBook);
app.delete("/api/v1/books/:id", authorize, booksController.deleteBookById);
app.post("/api/v1/upload", booksController.uploadBook);
// Auth
app.post("/api/v1/register", authController.register);
app.post("/api/v1/auth", authController.login);
// Users data
app.get("/api/v1/users", authorize, usersController.getAllUsers);
app.get("/api/v1/users/:id", authorize, usersController.getUserById);
app.get("/api/v1/me", authorize, usersController.getUserInfo);

app.listen(3000, () => console.log("App is listening on port 3000..."));
