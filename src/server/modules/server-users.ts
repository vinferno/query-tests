import { Request, Response } from "express";
import { User } from "../../shared/models/user.model.js";
import { UserModel } from "../schemas/user.schema.js";
import { app } from "./server-setup.js";
import { getUsers } from "./user-handlers.js";


const userHandlers = {
    getUsers: getUsers,
}




app.get('/users', userHandlers.getUsers);
app.post('/create-user', function(req,res){
    const {name, email, username} = req.body;
    const user = new UserModel({
        name,
        username,
        email,
    });
    user.save()
    .then((data) => {
        res.json({data});
    })
    .catch(err => {
        res.status(501);
        res.json({errors: err});
    })
});

app.delete('/delete-user/:id', function(req, res) {
    const _id = req.params.id;
    UserModel.findByIdAndDelete(_id).then((data) => {
        console.log(data);
        res.json({data});
    });
})

app.put('/update-user/:id', function(req, res) {
    console.log("Update user");
    UserModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: { name: req.body.name, email: req.body.email },
        },
        {
            new: true,
        },
        function(err, updateUser) {
            if(err) {
                res.send("Error updating user");
            }
            else{
                res.json(updateUser);
            }
        }
    )
});


export function findUsers() {
    UserModel.find()
    .populate('friends')
    .then(data => console.log(JSON.stringify(data, null, 4)))
    .catch(err => {
        console.error(err);
    })
}


function addUser(data: User) {
    const {name, email, username} = data;
    const user = new UserModel({
        name,
        username,
        email,
    });
    user.save()
    .then((data) => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    })
}

function addFriend(data: User, friend: string) {
    UserModel.update(
        { _id: data._id }, 
        { $push: { friends: friend } }
    ).then(data => console.log(data));
}

function updateUser() {
    UserModel.findByIdAndUpdate('61651836c7d62d74d646d7be', {username: 'five'}, {new: true}).then(data => console.log(data)).catch(e => console.log(e));
}

function updateUserFind() {
    UserModel.findOneAndUpdate({username: 'five'}, {name: 'five'}, {new: true}).then(data => console.log(data)).catch(e => console.log(e));
}

function updateUserFriend() {
    UserModel.findOneAndUpdate({username: 'one'}, {$push: {friends: '6165150643b44f05b0658e75'}}, {new: true}).then(data => console.log(data)).catch(e => console.log(e));
}
function removeUserFriend() {
    UserModel.findOneAndUpdate({username: 'five'}, {$pull: {friends: '61651807a7f5a7a89db14a96'}}, {new: true}).then(data => console.log(data)).catch(e => console.log(e));
}


function findInIds() {
    const ids = [
             '61651836c7d62d74d646d7be',
             '6165150643b44f05b0658e75'
           ]
    findIdsOne(ids);
    // findIdsTwo(ids);
}

function findIdsOne(ids: string[]) {
    console.time("answer time");
  
    UserModel.find().where('_id').in(ids).then(data => {
        console.log(JSON.stringify(data, null, 4));
        console.timeEnd("answer time");
    })
    .catch(err => {
        console.error(err);
    })
}

function findIdsTwo(ids: string[]) {
    console.time("answer2 time");
    // @ts-ignore: next-line
    UserModel.find({
        '_id': { $in: ids}
    }).then(data => {
        console.log(JSON.stringify(data, null, ));
        console.timeEnd("answer2 time");
    
    })
    .catch(err => {
        console.error(err);
    })
}

export async function findUserWithThisFriend() {
    const ids = await UserModel.find({}, '_id').where('username').equals('two').lean();
    
    UserModel.find().where('friends').in(ids).populate({path: 'friends'}).then(data => {
        console.log(JSON.stringify(data, null, 4));
        console.log(ids.map(user => user._id))
     
    })
    .catch(err => {
        console.error(err);
    })
}

function findUserByFriendName() {

    UserModel.find().populate({path: 'friends'}).where('friends.name').equals('four').exec().then(data => {
        console.log(JSON.stringify(data, null, 4));
     
    })
    .catch(err => {
        console.error(err);
    })
}

