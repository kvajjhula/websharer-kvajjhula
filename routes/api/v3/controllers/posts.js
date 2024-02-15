import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const { url, description, name } = req.body;
            console.log(url)
            console.log(description)
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
            allPosts.map(async ({ url, description, name, username }) => {
                try {
                    const htmlPreview = await getURLPreview(url)
                    return { description, htmlPreview, name, username }
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

export default router;