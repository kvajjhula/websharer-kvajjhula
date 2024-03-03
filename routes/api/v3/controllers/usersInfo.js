import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = req.query.user
        let userInfo = await req.models.UserInfo.find({user : user})
        res.json(userInfo)
    } catch (e) {
        console.log("Error getting userinfo from db", e)
        res.send(500).json({ "status": "error", "error": e })
    }
})

router.post('/', async (req, res) => {
    if (req.session.isAuthenticated) {
        const { user, favBuildingOnCampus, favColor } = req.body;
        console.log(req.body)
        try {
            let userInfo = await req.models.UserInfo.findOne({ user: user });
            if (userInfo) {
                userInfo.favBuildingOnCampus = favBuildingOnCampus;
                userInfo.favColor = favColor;
            } else {
                userInfo = new UserInfo({ user, favBuildingOnCampus, favColor });
            }
            await userInfo.save();
            res.send({ message: 'User info updated successfully', userInfo });

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

export default router;