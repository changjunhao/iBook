$(function () {
  $('.del').click(function (e) {
    const target = $(e.target)
    const id = target.data('id')
    const tr = $('.item-id-' + id)
    $.ajax({
      type: 'DELETE',
      url: '/admin/book/list?id=' + id
    })
      .done(function (results) {
        if (results.success === 1) {
          if (tr.length > 0) {
            tr.remove()
          }
        }
      })
  })
  $('#douban').blur(function () {
    const douban = $(this)
    const id = douban.val()
    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/book/' + id,
        catch: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function (data) {
          $('#inputTitle').val(data.title)
          $('#inputAuthor').val(data.author[0])
          $('#inputPublisher').val(data.publisher)
          $('#inputYear').val(data.pubdate)
          $('#inputIsbn').val(data.isbn13)
          $('#inputCover').val(data.images.large)
          $('#inputSummary').val(data.summary)
          $('#inputPrice').val(data.price)
        }
      })
    }
  })
})
