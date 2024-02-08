import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect("mongodb+srv://kriti:gzvOZ0EDVXrtDrzq@cluster0.0h9jp2a.mongodb.net/websharer") 

console.log("successfully connected to mongodb")

// schema and model

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: Date,
    name: String
})

models.Post = mongoose.model('Post', postSchema)
console.log("mongoose models created")

export default models;



