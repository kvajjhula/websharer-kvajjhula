import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const { url, description, name } = req.body;
            const newPost = new req.models.Post({
                url: url,
                description: description,
                name: name,
                created_date: Date.now(),
                username: req.session.account.username
            })
            await newPost.save()
            res.json({ "status": "success" })
        } catch (error) {
            console.log("Error getting users from db", error)
            res.send(500).json({ "status": "error", "error": error })
        }
    } else {
        res.send(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

router.get('/', async (req, res, next) => {
    let query = {};
    if (req.query.username) {
        query.username = req.query.username;
    }
    try {
        let allPosts = await req.models.Post.find(query)

        let postsWithPreviews = await Promise.all(
            allPosts.map(async (post) => {
                try {
                    const { description, name, username, likes, url, _id, created_date } = post
                    const id = _id.toHexString()
                    const htmlPreview = await getURLPreview(url)
                    return { description, htmlPreview, name, username, likes, id, created_date }
                } catch (error) {
                    console.log(error)
                }
            })
        );
        res.json(postsWithPreviews)
    } catch (error) {
        console.log("Error getting users from db", error)
        res.send(500).json({ "status": "error", "error": error })
    }
})

router.post('/like', async (req, res) => {
    if (req.session.isAuthenticated) {
        try {
            let postToLike = await req.models.Post.findById(req.body.postID);
            if (!postToLike) {
                return res.status(404).json({
                    status: "error",
                    error: "Post not found"
                });
            }
            const currentUser = req.session.account.username;
            if (!postToLike.likes.includes(currentUser)) {
                postToLike.likes.push(currentUser);
                await postToLike.save()
                res.json({ status: "success" })
            } else {
                res.json({ status: "success", message: "User already liked the post" });
            }
        } catch (e) {
            console.log(e);
            res.send(500).json({ "status": "error", "error": e })
        }
    } else {
        res.send(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

router.post('/unlike', async (req, res) => {
    if (req.session.isAuthenticated) {
        try {
            const currentUser = req.session.account.username;
            let postToLike = await req.models.Post.findById(req.body.postID);
            if (!postToLike) {
                return res.status(404).json({
                    status: "error",
                    error: "Post not found"
                });
            }
            if (postToLike.likes.includes(currentUser)) {
                postToLike.likes = postToLike.likes.filter(user => user !== currentUser)
                await postToLike.save()
                res.json({ status: "success" })
            }
        } catch (e) {
            console.log(e);
            res.send(500).json({ "status": "error", "error": e })
        }
    } else {
        res.send(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

router.delete('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
    try {
        let postToDelete = await req.models.Post.findById(req.body.postID);
        if (postToDelete.username === req.session.account.username) {
            // delete comments associated with the username
            await req.models.Comment.deleteMany({ post : req.body.postID })
            // delete post
            await req.models.Post.deleteOne({ _id: req.body.postID })
            console.log("Post deleted");
            return res.json({ status: "success" });
        } else {
            return res.status(401).json({
                status: "error",
                error: "you can only delete your own posts"
            })
        }
    } catch (e) {
        console.log(e);
        res.send(500).json({ "status": "error", "error": e })
    }
})



export default router;