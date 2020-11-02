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
  .connect('mongodb://akrom1996:akrom1996@ds235768.mlab.com:35768/ecommerce')
  .then(() => {
    console.log('conneted to database');
    app.listen(4000, () => {
      console.log('listening for requests on port 4000');
    });
  });
