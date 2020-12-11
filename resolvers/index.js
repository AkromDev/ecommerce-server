const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const Order = require('../models/order');

const authMutations = require('./authMutations');
const { checkIfAdmin, checkAuth } = require('../utils/authValidation');
const throwError = require('../utils/throwError');
const httpCodes = require('../constants/httpCodes');

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
      checkAuth(req)
      const {userId} = req
      const orders = await Order.find({ userId });
      return orders || []
    },
    myOrder: async (_, { orderId }, {req}) => {
      checkAuth(req)
      const {userId} = req
      const order = await Order.findOne({_id: orderId, userId});
      if(!order){
        throw new Error('Order is not found with that order id');
      }
      return order
    },
    me: (_, __, {req}) => {
      checkAuth(req)
      const {userId} = req
      return User.findById(userId)
    },
  },
  Mutation: {
    createStore: async(parent, { input }, {req}) => {
      await checkIfAdmin(req)
      const { email, password, name, phone, address } = input;
      const store = await Store.findOne({email})
      if(store){
        throwError({
          message:'Another store already exists with this email',
          code: httpCodes.INVALID_INPUT
        })
      }
      const newStore = new Store({
        email,
        password,
        name,
        phone,
        address,
      });
      return newStore.save();
    },
    createOrder: (parent, { input }, { req }) => {
      checkAuth(req)
      const { products = [], receiver } = input;
      const order = new Order({
        userId: req.userId,
        products,
        receiver
      });
      return order.save();
    },
    createProduct: async (parent, { input }, { req }) => {
      await checkIfAdmin(req)
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
