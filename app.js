const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

mongoose
  .connect('mongodb://akrom:akrom1996@ds135179.mlab.com:35179/books')
  .then(() => {
    console.log('conneted to database');
    app.listen(4000, () => {
      console.log('listening for requests on port 4000');
    });
  });
