const router = require('express').Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const Post = require('../../models/BlogPost');

//update 
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id){
        console.log(req.body.password)

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);

        }
        try{
            const user = await User.findOneAndUpdate(req.params.id, {
                $set: req.body
            })
            return res.status(201).json("updated the user successfully")

        }
        catch(err){
            return res.status(400).json("error while updating the user")
        }
    }
    else{
        return res.status(401).json("Wrong Credentials")
    }
})

//delete

router.patch('/:id', async (req, res)=>{
    console.log(req.body)
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findById(req.body.userId);
            const blogs = await BlogPost.deleteMany({
                username: user.username
            })
            const result = await User.findByIdAndDelete(req.body.userId);
            return res.status(201).json("Deleted the user successfully")
            
        }
        catch{
            return res.status(400).json("Error while deleting the user")
        }
    }
    
    else{
        return res.status(400).json("Access denied")
    }
})

//get the user
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(400).json("No user founded")
        }
        else{
            const {password, ...others} = user._doc;
            return res.status(200).json(others)
        }
    }
    catch{
        return res.status(400).json("Error while getting the user")
    }
})


module.exports = router;