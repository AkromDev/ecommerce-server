const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const Order = require('../models/order');

const authMutations = require('./authMutations');

module.exports = {
  Query: {
    products: () => Product.find({}),
    product: (parent, { _id }) => Product.findById(_id),
    stores: () => {
      return Store.find({});
    },
    store: (_, { _id }) => {
      return Store.findById(_id);
    },
    myOrders: async (parent, _, { req }) => {
      const {userId, isAuth} = req
      if (!isAuth || !userId) {
        throw new Error('Not authenticated!');
      }
      const orders = await Order.find({ userId });
      return orders || []
    },
    myOrder: async (_, { orderId }, {req}) => {
      const {userId, isAuth} = req
      if (!isAuth || !userId) {
        throw new Error('Not authenticated!');
      }
      const order = await Order.findOne({_id: orderId, userId});
      if(!order){
        throw new Error('Order is not found with that order id');
      }
      return order
    },
    me: (_, __, {req}) => {
      const {userId, isAuth} = req
      if (!isAuth || !userId) {
        throw new Error('Not authenticated!');
      }
      return User.findById(userId)
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
    createOrder: (parent, { input }, { req }) => {
      if (!req.isAuth) {
        throw new Error('Not authenticated!');
      }
      const { userId, products = [] } = input;
      const order = new Order({
        userId,
        products,
      });
      return order.save();
    },
    createProduct: (parent, { input }, { req }) => {
      if (!req.isAuth) {
        throw new Error('Not authenticated!');
      }
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
  Order: {
    user: (parent) => {
      return User.findById(parent.userId);
    },
    productsOrdered: async (parent) => {
      const {products: orderedProds} = parent
      const prodIds = orderedProds.map(p => p.productId)
      const products = await Product.find({_id: {$in: prodIds}});
      return orderedProds.map((p,i) => ({
        quantity: p.quantity,
        productId: p.productId,
        product: products[i]
      }))
    },
  },
};
