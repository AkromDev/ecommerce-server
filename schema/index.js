const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    products: [Product!]!
    product(_id: ID!): Product!
    stores: [Store!]!
    store(_id: ID!): Store!
  }
  type Mutation {
    createStore(
      email: String!
      password: String!
      name: String!
      phone: String!
      address: String
    ): Store!
    createProduct(
      storeId:ID!
      title:String!
      price:Int!
      imageUrl:String!
      description:String!
    ): Product!
  }
  type Product {
    _id:ID!
    storeId:ID!
    store: Store!
    title:String!
    price:Int!
    description:String!
    imageUrl:String!
  }
  type Store{
    _id: ID!
    email: String!
    password: String!
    name: String!
    phone: String!
    address: String
    products: [Product!]!
  }
`;
