const Product = require('../models/product');
const Store = require('../models/store');

module.exports = {
  Query: {
    products: () => Product.find({}),
    product: (parent, { _id }) => Product.findById(_id),
    stores: () => Store.find({}),
    store: (parent, { _id }) => Store.findById(_id),
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
