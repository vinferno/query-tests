import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const CategorySchema = new Schema({
    name: {type: String, required: true},
    subCategories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    parentCategory: {type: Schema.Types.ObjectId, ref: 'Category'}
});

export const CategoryModel = model('Category', CategorySchema);