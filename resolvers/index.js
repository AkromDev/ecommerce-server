const Book = require("../models/book");
const Author = require("../models/author");
module.exports = {
  Query: {
    book: (parent, { id }) => Book.findById(id),
    author: (parent, { id }) => Author.findById(id),
    books: () => Book.find({}),
    authors: () => Author.find({})
  },
  Mutation: {
    addAuthor: (parent, { name, age }) => {
      const author = new Author({
        name,
        age
      });
      return author.save();
    },
    addBook: (parent, { name, genre, authorId }) => {
      const book = new Book({
        name,
        genre,
        authorId
      });
      return book.save();
    }
  },
  Author: {
    books: parent => {
      return Book.find({ authorId: parent.id });
    }
  },
  Book: {
    author: parent => {
      return Author.findById(parent.authorId);
    }
  }
};
