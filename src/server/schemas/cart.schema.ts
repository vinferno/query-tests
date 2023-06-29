import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const CartSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
});

export const CartModel = model('Cart', CartSchema);