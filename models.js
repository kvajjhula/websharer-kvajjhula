import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

mongoose.connect("mongodb+srv://kriti:gOcHX5m4ktsipxaw@cluster0.0h9jp2a.mongodb.net/websharer") 

console.log("successfully connected to mongodb")

// schema and model

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)
console.log("mongoose models created")

export default models;



