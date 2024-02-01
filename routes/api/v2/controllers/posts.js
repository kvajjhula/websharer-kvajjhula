import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res, next) => {
    try {
        const { url, description, name } = req.body;
        console.log(url)
        console.log(description)
        const newPost = new req.models.Post({
            url: url,
            description: description,
            name: name,
            created_date: Date.now()
        })
        await newPost.save()
        res.json({ "status": "success" })
    } catch (error) {
        console.log("Error getting users from db", error)
        res.send(500).json({ "status": "error", "error": error })
    }
})

router.get('/', async (req, res, next) => {
    try {
        let allPosts = await req.models.Post.find()

        let postsWithPreviews = await Promise.all(
            allPosts.map(async ({ url, description, name }) => {
                try {
                    const htmlPreview = await getURLPreview(url)
                    return { description, htmlPreview, name }
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