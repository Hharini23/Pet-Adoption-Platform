const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    petName: { type: String, required: true },
    paymentScreenshot: {
        data: Buffer,
        contentType: String
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
