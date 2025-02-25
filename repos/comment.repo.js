const Comment = require('../models/comment.model')

class CommentRepository {
    async createComment(commentData) {
        return await Comment.create(commentData);
    }
    async getAllComments() {
        return await Comment.find().sort({ createdAt: -1 });
    }

    async getCommentsByUser(userId) {
        return await Comment.find({ userId });

    }

    async  deleteComment(commentId)  {
        return await Comment.findByIdAndDelete(commentId);
    };
    

}
module.exports = new CommentRepository();