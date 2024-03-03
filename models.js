import mongoose, { Schema } from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect("mongodb+srv://kriti:BCF5PQk4DhWPcb4p@cluster0.0h9jp2a.mongodb.net/websharer")

console.log("successfully connected to mongodb")

// schema and model

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: Date,
    name: String,
    username: String,
    likes: [String]
})

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    created_date: Date

})

const userInfoSchema = new mongoose.Schema({
    favBuildingOnCampus: String,
    favColor: String,
    user: String
})
models.UserInfo = mongoose.model('UserInfo', userInfoSchema);
models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema)
console.log("mongoose models created")

export default models;



