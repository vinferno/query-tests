

import { PostModel } from './schemas/post.schema.js';
import { UserModel } from './schemas/user.schema.js';
import mongoose from 'mongoose';
import { User } from '../shared/models/user.model.js';
import { ProductModel } from './schemas/product.schema.js';
import { CategoryModel } from './schemas/category.schema.js';
import { app } from './modules/server-setup.js';
import { findUserWithThisFriend, findUsers } from './modules/server-users.js';
import { request, Request, Response } from 'express';
import { CartModel } from './schemas/cart.schema.js';



mongoose.connect('mongodb://localhost:27017/query-tests')
.then(async () => {
    console.log('Connected to DB Successfully');
    // getProducts();
    const users = await getUsers();
    console.log(users);

    // const userOne = await getUserByName('one');
        // console.log(userOne);

    // const userTwo = await getUserByName('two');

    // const followers = await whoIsFollowingMe(userOne?._id);
    // console.log(JSON.stringify(followers, null, 4));

    const agg = await aggregate();
    console.log(agg);

    // console.log(userTwo);
    // console.log(userTwo?._id);

    // const updatedUserTwo = await followUser(userTwo?._id, userOne?._id);
    // console.log(updatedUserTwo);
    //  const user = await getUser();
    //  console.log(user?._id);
    //  const carts = await getCarts();
    //  console.log(carts);
    //  const usersCart = await getCartByUserId(user?._id);
    //  console.log(usersCart);

    //  const products = await getProducts();
    //  console.log(products);

    //  const afterCart = await addProductToCart(user?._id, products[0]?._id);
    //  console.log(afterCart);
    //  const cart = await createCart(user?._id);
    //  console.log(cart);
    // findUsers();
    // addUser({name: 'one', email: 'v', username: 'un'});
    // updateUser();
    // updateUserFind();
    // updateUserFriend();
    // removeUserFriend();
    // findInIds();
    // findUserWithThisFriend();
    // findUserByFriendName();
})
.catch(err => console.log('Failed to Connect to DB', err))




app.get('/', function(req, res) {
   res.json({message:'test'});
});

app.get('/posts', function(req,res){
    PostModel.find()
    .then(data => res.json({data}))
    .catch(err => {
        res.status(501)
        res.json({errors: err});
    })
});


app.post('/create-post', function(req,res){
    const {title, body} = req.body;
    const post = new PostModel({
        title,
        body,
    });
    post.save()
    .then((data) => {
        res.json({data});
    })
    .catch(err => {
        res.status(501);
        res.json({errors: err});
    })
});


app.get('/products',  getProductsHandler);
app.get('/categories',  (req, res) => {
    CategoryModel.find().populate('subCategories parentCategory subCategories.subCategories').then(data => {
        res.json({data});
    })
});

app.post('/products',  (req, res) => {
    const product = new ProductModel(req.body)
    product.save().then(data => {
        res.json({data})
    });
});
app.post('/categories',  (req, res) => {
    const category = new CategoryModel(req.body)
    category.save().then(data => {
        res.json({data})
    });
});
app.post('/add-subcategory',  (req: any, res) => {
    console.log(req.body)
    CategoryModel.findByIdAndUpdate(req.body.id, {
        $push: { subCategories: req.body.sub }
    }, {new: true}).then( data => {
        res.json({data});
    }).catch(err => {console.log(err)})
});

app.post('/add-parent-category',  (req: any, res) => {
    console.log(req.body)
    CategoryModel.findByIdAndUpdate(req.body.id, {
        parentCategory: req.body.parent
    }, {new: true}).then( data => {
        res.json({data});
    }).catch(err => {console.log(err)})
});

app.get('/get-all-the-users', getAllUsersHandler)

app.post('follow-user', (req, res) => {
    const {userId, followId} = req.body;
    followUser(userId, followId)
    .then(updatedUser => {
        res.json(updatedUser);
    }).catch(err => {
        res.sendStatus(402);
    })
});

async function getAllUsersHandler(req: Request, res: Response) {
    const users = await getUsers();
    res.json(users);
}




function getProductsHandler(req: Request, res: Response){
    const products = getProducts();
    res.json(products);
}

async function getProducts() {
    const products = await ProductModel.find();
    console.log(products);
    return products;
}



async function getUser() {
    const user = await UserModel.findOne({}).lean();
    return user;
}

async function createCart(userId: any) {
    const cart = await new CartModel({
        user: userId,
        products: []
    });
    cart.save();

    return cart;
}

async function getCartByUserId(userId: any) {
    const cart = await CartModel.findOne({user: userId});
    return cart;
}

async function getCarts() {
    const carts = await CartModel.find();
    return carts;
}

async function addProductToCart(userId: any, productId: any) {
    const cart = await CartModel.findOneAndUpdate({user: userId},{
        $push: { products: productId}
    }, {new: true}).populate('products user');
   return cart;
}

function getUsers() {
    const users = UserModel.find();
    return users;
}

function getUserByName(name: string) {
    return UserModel.findOne({name}).populate('following');
}

function followUser(userId: any, followId: any) {
    console.log(userId, 'userId', followId)
    return UserModel.findOneAndUpdate({_id: userId},{
        $push: { following: followId},
    }, {new: true}).populate('following');
}

function whoIsFollowingMe(_id: any) {
    return UserModel.find({following: _id}).count()
}

function aggregate() {
    return UserModel.aggregate().project({
        _id: 1,
        firstName: '$name',
        friends: '$friends',
        friendsCount: {$size: { "$ifNull": [ "$following", [] ] } }
    }).group({
        _id: null,
        totalFriends : {$sum: '$friendsCount'}
    })
}