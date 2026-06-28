document.addEventListener('DOMContentLoaded', function () {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content

  document.querySelectorAll('.del').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const target = e.currentTarget
      const id = target.dataset.id
      const tr = document.querySelector('.item-id-' + id)
      const delUrl = target.dataset.url || '/admin/book/list?id=' + id

      fetch(delUrl, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json'
        }
      })
        .then(function (res) { return res.json() })
        .then(function (results) {
          if (results.success === 1 && tr) {
            tr.remove()
          }
        })
        .catch(function (err) {
          console.error('Delete failed:', err)
        })
    })
  })
})
