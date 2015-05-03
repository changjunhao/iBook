var Comment = require('../models/comment')
exports.save = function(req,res,next){
	var _comment = req.body.comment
	var bookId = _comment.book
	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content:_comment.content
			}
			comment.reply.push(reply)
			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect('/book/'+bookId)
			})
		})
	}else{
		var comment = new Comment(_comment)
		comment.save(function(err,comment){
			if(err){
				console.log(err)
			}
			res.redirect('/book/'+bookId)
		})
	}
}