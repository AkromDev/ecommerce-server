const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  products: [
    {
      productId: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: Schema.Types.String,
  },
  orderDate: { type: Date, default: Date.now },
  cancellationDate: Date,
  shipmentDate: Date,
  deliveryDate: Date,
});

module.exports = mongoose.model('Order', orderSchema);
