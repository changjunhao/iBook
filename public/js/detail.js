document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.comment').forEach(function (el) {
    el.addEventListener('click', function () {
      const toId = this.dataset.tid
      const commentId = this.dataset.cid
      const form = document.getElementById('commentForm')

      const toIdInput = document.getElementById('toId')
      if (toIdInput) {
        toIdInput.value = toId
      } else {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.id = 'toId'
        input.name = 'comment[tid]'
        input.value = toId
        form.appendChild(input)
      }

      const commentIdInput = document.getElementById('commentId')
      if (commentIdInput) {
        commentIdInput.value = commentId
      } else {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.id = 'commentId'
        input.name = 'comment[cid]'
        input.value = commentId
        form.appendChild(input)
      }
    })
  })
})
