const Product = require("../models/product");
const Owner = require("../models/owner");
module.exports = {
  Query: {
    product: (parent, { id }) => Product.findById(id),
    owner: (parent, { id }) => Owner.findById(id),
    products: () => Product.find({}),
    owners: () => Owner.find({})
  },
  Mutation: {
    addOwner: (parent, { name, phone, age }) => {
      const ownerId = new Owner({
        name,
        phone,
        age
      });
      return ownerId.save();
    },
    addProduct: (parent, { name, category, ownerId }) => {
      const product = new Product({
        name,
        category,
        ownerId
      });
      return product.save();
    }
  },
  Owner: {
    products: parent => {
      return Product.find({ ownerId: parent.id });
    }
  },
  Product: {
    ownerId: parent => {
      return Owner.findById(parent.ownerIdId);
    }
  }
};
