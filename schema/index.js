const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    product(id: ID!): Product!
    products: [Product!]!
    owner(id: ID!): Owner!
    owners: [Owner!]!
  }
  type Mutation {
    addOwner(name: String!, phone: String!, age: Int!): Owner!
    addProduct(name: String!, category: String!, ownerId: ID!): Product!
  }
  type Owner {
    _id: ID!
    name: String!
    age: Int!
    phone: String!
    products: [Product!]!
  }
  type Product {
    _id: ID!
    name: String!
    category: String!
    ownerId: ID!
    owner: Owner!
  }
`;
