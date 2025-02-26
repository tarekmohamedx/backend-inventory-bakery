const commentService = require ('../services/comment.service')
const authMiddleware = require('../middlewere/authentication.middlewere');
const Comment = require ('../models/comment.model')
const router = require("express").Router();

module.exports= (()=>{

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
console.log(req.body)
        if (!message) return res.status(400).json({ message: 'Message is required' });

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user info' });
        }
       
        const newComment = new Comment({
            userId: req.user.userId, 
            email: req.user.email,
            message,
            createdAt: new Date(),
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error('Error saving comment:', err);
        res.status(500).json({ message: 'Error submitting comment' });
    }
});

// get comments
router.get('/all',async(req,res)=>{
    try{
        const comments = await commentService.getComments()
        res.status(200).json(comments);
       
        }catch(error){
        res.status(500).json({ error: error.message });
        
        }
        

})
// delete comment
router.delete('/:id',async(req,res)=>{
    try {
        const { id } = req.params;
        await commentService.deleteComment(id);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
)

return router;

})();




