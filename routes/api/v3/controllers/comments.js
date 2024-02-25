import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
    try {
        let allComments = await req.models.Comment.find({post: req.query.postID})
        res.json(allComments)
    } catch (e) {
        console.log("Error getting comments from db", e)
        res.send(500).json({ "status": "error", "error": e })
    }
})

router.post('/', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }

    try {
        const { newComment, postID } = req.body;
        const newCommentEntry = new req.models.Comment({
            username: req.session.account.username,
            comment: newComment,
            post: postID,
            created_date: Date.now()
        })
        await newCommentEntry.save()
        res.json({ "status": "success" })
    } catch (e) {
        console.log("Error posting comments from db", e)
        res.send(500).json({ "status": "error", "error": e })
    }
})


export default router;