const router = require("express").Router();
const CommentModel = require("../../models/Comment");

router.get('/', async (req, res) => {
    try{
        const comments = await CommentModel.find();
        return res.json(comments);
    }
    catch(err){
        return err;
    }

})

router.post('/:blogid', async (req, res) => {
    var id = await CommentModel.find().length + 1; 
    if(!id){
        id = 0;
    }
    const blogId = req.params.blogid;
    const comment = await CommentModel(
        {
            blogId: blogId,
            username: req.body.username,
            parentId: req.body.parentId,
            body: req.body.body,
            id: id
        }
    )
    try{
        comment.save();
        return res.json("created successfully");
    }
    catch(err){
        return res.json(err);
    }

})

router.delete('/:commentid', async (req, res) => {
    console.log("deleting!!")
    const commentId = req.params.commentid;
    try{
        const comment = await CommentModel.find({id: commentId});
        console.log("oparent", comment)
        if(!comment.parentId){
            console.log("in")
            const childrenComment = await CommentModel.deleteMany(
                {
                    "parentId": commentId
                }
            )
            
            const parentComment = await CommentModel.deleteOne({id: commentId});
            return res.json("deleted successfully");
        }
        else{
            console.log("into else ")
            const parentComment = await CommentModel.findByIdAndDelete(commentId);
            return res.json("deleted successfully");
        }     
    }
    catch(err){
        console.log("into catch")
        return res.json("error");
    }
})

router.put('/:commentid', async (req, res) => {
    

    const commentId = req.params.commentid;
    console.log("updating!!!", commentId)
    try{
        const comment1 = await CommentModel.findOne({id: commentId});
        console.log(comment1)
        const comment = await CommentModel.findOneAndUpdate({id: commentId}, {
            $set: req.body
        });
        console.log(comment)
        return res.json("updated  successfully");
    }
    catch(err){
        return res.json(err);
    }
})

router.get('/:blogId', async (req, res) => {
    const blogId = req.params.blogId;
    console.log(req.cookies, "cookies")
    try{
        const comments = await CommentModel.find({blogId: blogId});
        console.log(comments)
        return res.json(comments);
    }
    catch(err){
        return err;
    }

})
module.exports = router;