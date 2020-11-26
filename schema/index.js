const { gql } = require('apollo-server-express');
module.exports = gql`
  # queries
  type Query {
    products: [Product!]!
    product(_id: ID!): Product!
    myOrders: [Order!]!
    myOrder(orderId: ID!): Order!
    stores: [Store!]!
    store(_id: ID!): Store!
    me: User!
  }

  # mutations
  type Mutation {
    createStore(input: CreateStoreInput!): Store!
    createProduct(input: CreateProductInput!): Product!
    createOrder(input: CreateOrderInput!): Order!
    signup(input: SignupInput!): RegularResponse!
    resendConfirmation(input: EmailInput!): RegularResponse!
    sendResetPasswordOTP(input: EmailInput!): SendResetPasswordOTPRes!
    resetPassword(input: ResetPasswordInput!): RegularResponse!
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
    firstName: String!
    lastName: String!
    isVerified: Boolean!
    roles: [String]
    address: String
    phone: String
  }
  type RegularResponse {
    success: Boolean!
    message: String!
  }
  type SendResetPasswordOTPRes {
    success: Boolean!
    message: String!
    userId: ID!
  }
  type Token {
    token: String!
    userId: ID!
  }
  type Order {
    _id: ID!
    userId: ID!
    user: User!
    productsOrdered: [ProductOrdered!]!
  }
  type ProductOrdered{
    quantity: Int!
    product: Product!
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
  input EmailInput {
    email: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input ResetPasswordInput {
    password: String!
    otp: Int!
    userId: ID!
  }
  input CreateOrderInput {
    userId: ID!
    products: [OrderProduct!]!
  }

  input OrderProduct {
    productId: ID!
    quantity: Int!
  }
`;
