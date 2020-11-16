const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const auth = require('./middleware/auth');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (!err.originalError) {
      return err;
    }
    if (err.message.startsWith('Database Error: ')) {
      err.message = 'Internal server error';
    }
    const data = err.originalError.data;
    const message = err.message || 'Internal server error.';
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
  .connect('mongodb://akrom1996:akrom1996@ds235768.mlab.com:35768/ecommerce')
  .then(() => {
    console.log('conneted to database');
    app.listen(4000, () => {
      console.log('listening for requests on port 4000');
    });
  });
