const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

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
    signup: async function (_, { input }) {
      const { email, password, firstName, lastName, address, phone } = input;
      const errors = [];
      if (!validator.isEmail(email)) {
        errors.push({ message: 'E-Mail is invalid.' });
      }
      if (
        validator.isEmpty(password) ||
        !validator.isLength(password, { min: 5 })
      ) {
        errors.push({ message: 'Password too short!' });
      }
      if (validator.isEmpty(firstName)) {
        errors.push({ message: 'First name is required!' });
      }
      if (validator.isEmpty(lastName)) {
        errors.push({ message: 'Last name is required!' });
      }

      if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        firstName,
        lastName,
        address,
        phone,
        password: hashedPw,
      });
      const createdUser = await user.save();
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    login: async function (_, { input }) {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('User not found.');
        error.code = 401;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error('Password is incorrect.');
        error.code = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
        },
        'tokensecretdev',
        { expiresIn: '1h' }
      );
      return { token: token, userId: user._id.toString() };
    },
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
