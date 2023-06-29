import { EnforceDocument, Model } from "mongoose";

export async function getAll<T>(Model: Model<T> ) {
    const data =  await Model.find();
    return data;
}