const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');

const authMutations = require('./authMutations');

module.exports = {
  Query: {
    products: () => Product.find({}),
    product: (parent, { _id }) => Product.findById(_id),
    stores: (parent, params, { req }) => {
      if (!req.isAuth) {
        throw new Error('Not authenticated!');
      }
      return Store.find({});
    },
    store: (_, { _id }, req) => {
      if (!req.isAuth) {
        throw new Error('Not authenticated!');
      }
      return Store.findById(_id);
    },
    user: (_, { _id }) => User.findById(_id),
  },
  Mutation: {
    createStore: (parent, { input }) => {
      const { email, password, name, phone, address } = input;
      const store = new Store({
        email,
        password,
        name,
        phone,
        address,
      });
      return store.save();
    },
    createProduct: (parent, { input }) => {
      const { storeId, title, price, imageUrl, description } = input;
      const product = new Product({
        storeId,
        title,
        price,
        imageUrl,
        description,
      });
      return product.save();
    },
    ...authMutations,
  },
  Store: {
    products: (parent) => {
      return Product.find({ storeId: parent._id });
    },
  },
  Product: {
    store: (parent) => {
      return Store.findById(parent.storeId);
    },
  },
};
