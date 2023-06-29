import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const ProductSchema = new Schema({
    name: {type: String, required: true},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

export const ProductModel = model('Product', ProductSchema);