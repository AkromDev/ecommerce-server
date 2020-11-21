const { gql } = require('apollo-server-express');
module.exports = gql`
  # queries
  type Query {
    products: [Product!]!
    product(_id: ID!): Product!
    stores: [Store!]!
    store(_id: ID!): Store!
    user(_id: ID!): User!
  }

  # mutations
  type Mutation {
    createStore(input: CreateStoreInput!): Store!
    createProduct(input: CreateProductInput!): Product!
    signup(input: SignupInput!): SignupRes!
    resendConfirmation(input: ResendConfirmationInput!): SignupRes!
    login(input: LoginInput!): Token!
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
  type User {
    _id: ID
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    isVerified: Boolean!
    roles: [String]
    address: String
    phone: String
  }
  type SignupRes {
    success: Boolean!
    message: String!
    userId: ID!
  }
  type Token {
    token: String!
    userId: ID!
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
  input SignupInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    address: String
    phone: String
  }
  input ResendConfirmationInput {
    email: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
`;
