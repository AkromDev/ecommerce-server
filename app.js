if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const auth = require("./middleware/auth");
const userController = require("./controllers/userController");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const port = process.env.PORT || 4000;
const app = express();
app.set("port", port);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(auth);
app.get("/email-confirmation/:token", userController.confirmationPost);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (!err.originalError) {
      return err;
    }
    if (err.message.startsWith("Database Error: ")) {
      err.message = "Internal server error";
    }
    const data = err.originalError.data;
    const message = err.message || "Internal server error.";
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data };
  },
  context: ({ req, res }) => ({
    req,
    res,
  }),
});

server.applyMiddleware({ app });

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("conneted to database");
    app.listen(port, () => {
      console.log("listening for requests on port " + port);
    });
  });
