
const commentRepo = require ('../repos/comment.repo')
const user = require('../models/users.model')
class commentService{
async addComment(user,message){
const commentData={
    userId: user.id,
    email: user.email,
    message,
  };

return await commentRepo.createComment(commentData)
}


async getComments(user){
   
 return await commentRepo.getAllComments()
    
    //return await commentRepo.getCommentsByUser(user.id)
}
async deleteComment(commentId) {
    return await commentRepo.deleteComment(commentId);
}
}


module.exports = new commentService();







