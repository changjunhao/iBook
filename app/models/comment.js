let mongoose = require('mongoose')
let CommentSchema = require('../schemas/comment')
let Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
