const { gql } = require("apollo-server-express");
module.exports = gql`
  type Query {
    book(id: ID!): Book!
    books: [Book!]!
    author(id: ID!): Author!
    authors: [Author!]!
  }
  type Mutation {
    addAuthor(name: String!, age: Int!): Author!
    addBook(name: String!, genre: String!, authorId: ID!): Book!
  }
  type Author {
    name: String!
    age: Int!
    books: [Book!]!
  }
  type Book {
    name: String!
    genre: String!
    authorId: ID!
    author: Author!
  }
`;
