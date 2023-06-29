import { Request, Response } from "express";
import { UserModel } from "../schemas/user.schema.js";

export function getUsers(req: Request, res: Response){
    UserModel.find()
    .then(data => res.json({data}))
    .catch(err => {
        res.status(501)
        res.json({errors: err});
    })
}