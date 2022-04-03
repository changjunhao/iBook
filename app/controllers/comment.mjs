import Comment from '../models/comment.mjs'

const save = (req, res, next) => {
  const _comment = req.body.comment
  const bookId = _comment.book
  if (_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment) {
      const reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply)
      comment.save(function(err, comment) {
        if (err) {
          console.log(err)
        }
        res.redirect('/book/' + bookId)
      })
    })
  } else {
    const comment = new Comment(_comment)
    comment.save(function(err, comment) {
      if (err) {
        console.log(err)
      }
      res.redirect('/book/' + bookId)
    })
  }
}

export default {
  save
}
