const { gql } = require('apollo-server-express');
module.exports = gql`
  # queries
  type Query {
    products: [Product!]!
    product(_id: ID!): Product!
    stores: [Store!]!
    store(_id: ID!): Store!
  }

  # mutations
  type Mutation {
    createStore(input: CreateStoreInput!): Store!
    createProduct(input: CreateProductInput!): Product!
  }

  # response types
  type Product {
    _id: ID!
    title: String!
    price: Int!
    description: String!
    imageUrl: String!
    storeId: ID!
    store: Store!
  }
  type Store {
    _id: ID!
    email: String!
    password: String!
    name: String!
    phone: String!
    address: String
    products: [Product!]!
  }

  # input types
  input CreateStoreInput {
    email: String!
    password: String!
    name: String!
    phone: String!
    address: String
  }
  input CreateProductInput {
    storeId: ID!
    title: String!
    price: Int!
    imageUrl: String!
    description: String!
  }
`;
