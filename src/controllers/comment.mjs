import Comment from '../models/comment.mjs'

export const save = async (req, res, next) => {
  const _comment = req.body.comment
  const bookId = _comment.book
  try {
    if (_comment.cid) {
      const comment = await Comment.findById(_comment.cid)
      const reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply)
      await comment.save()
      res.redirect('/book/' + bookId)
    } else {
      const comment = new Comment(_comment)
      await comment.save()
      res.redirect('/book/' + bookId)
    }
  } catch (err) {
    next(err)
  }
}
