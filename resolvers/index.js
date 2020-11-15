const Product = require("../models/product");
const Store = require("../models/store");

module.exports = {
  Query: {
    products: () => Product.find({}),
    product: (parent, { _id }) => Product.findById(_id),
    stores: () => Store.find({}),
    store: (parent, { _id }) => Store.findById(_id),
  },
  Mutation: {
    createStore: (parent, { 
      email,
      password,
      name,
      phone,
      address,
    }) => {
      const store = new Store({
        email,
        password,
        name,
        phone,
        address,
      });
      return store.save();
    },
    createProduct: (parent, { 
      storeId,
      title,
      price,
      imageUrl,
      description,
     }) => {
      const product = new Product({
        storeId,
        title,
        price,
        imageUrl,
        description,
      });
      return product.save();
    }
  },
  Store: {
    products: parent => {
      return Product.find({ storeId: parent._id });
    }
  },
  Product: {
    store: parent => {
      return Store.findById(parent.storeId);
    }
  }
};
