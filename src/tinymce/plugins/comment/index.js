(function() {
  const DATA_COMMENT_ID = 'data-comment-id'
  const DATA_COMMENT_CONTENT = 'data-comment-content'
  // eslint-disable-next-line no-undef
  tinymce.PluginManager.add('comment', function(editor) {
    const noop = () => {}
    const option = (name, defaultValue) => editor.options.get(name) ?? defaultValue

    editor.options.register('comment_events', {
      processor: 'object',
      default: {}
    })
    const comment_events = option('comment_events', {})
    const commentAddCallback = comment_events.add ?? noop
    const commentDeleteCallback = comment_events.delete ?? noop
    const commentShowCallback = comment_events.show ?? noop
    const hideCommentCallback = comment_events.hide ?? noop

    // 命令 - 添加批注
    editor.addCommand('addComment', function() {
      // 弹出评论对话框
      editor.windowManager.open({
        title: '添加评论',
        body: {
          type: 'panel',
          items: [
            {
              type: 'textarea',
              name: 'commentContent',
              label: '评论内容',
              multiline: true,
              minWidth: 400,
              minHeight: 300
            }
          ]
        },
        buttons: [
          {
            type: 'submit',
            text: '添加',
            primary: true
          },
          {
            type: 'cancel',
            text: '取消'
          }
        ],
        onSubmit: function(api) {
          // 获取评论内容并处理
          var commentText = api.getData().commentContent
          if (commentText) {
            var comment = {
              commentId: 'comment_' + new Date().getTime(),
              range: editor.selection.getRng(),
              comment: commentText
            }
            commentAddCallback(comment)
            showCommentMark(comment)
            editor.nodeChanged()
          }
          // 在这里进行评论保存或处理的逻辑
          // 例如，可以将评论内容插入到编辑器中
          // editor.insertContent('<span class="comment">' + comment + '</span>')
          // 关闭对话框
          api.close()
        }
      })
    })

    // 命令 - 显示所有批注
    editor.addCommand('showComments', function() {
      commentShowCallback()
    })

    // 命令 - 删除当前选中的批注
    editor.addCommand('deleteComment', function() {
      var commentIds = getSelectedCommentIds()
      if (commentIds.length) {
        commentIds.forEach(commentId => {
          deleteCommentById(commentId) // 删除评论区和编辑区该批注
        })
      }
    })
    // 命令 - 隐藏批注
    editor.addCommand('hideComment', function() {
      hideCommentCallback()
    })

    // 命令 - selectedComment
    editor.addCommand('selectedComment', function(commentId) {
      editor.selection.select(editor.dom.select(`[id="${commentId}"]`)[0])
    })

    // 选择高亮
    editor.on('SelectionChange', function() {
      const commentIds = getSelectedCommentIds()
      if (commentIds.length) {
        commentShowCallback([...commentIds])
      }
    })

    // 获取当前选中批注的 ID
    function getSelectedCommentIds() {
      const content = editor.selection.getContent() // 由于需要鼠标点在图标上识别而不是在图标后，所以需要找到图标的父节点
      var tempElement = document.createElement('div')
      tempElement.innerHTML = content
      // 查找具有指定 data-comment-id 属性的元素
      var elementsToRemove = tempElement.querySelectorAll('.comment[data-comment-id]')
      return Array.from(elementsToRemove).map(i => i.getAttribute(DATA_COMMENT_ID))
    }

    // 根据批注 ID 删除评论区的批注 -gao
    function deleteCommentById(commentId) {
      remoceCommentNode(commentId)
    }
    // 根据批注 ID 删除tinymce编辑区中的评论节点 -gao
    function remoceCommentNode(commentId) {
      if (commentId) {
        // 获取编辑器内容
        var content = editor.getContent()
        // 创建一个临时 DOM 元素来处理编辑器内容
        var tempElement = document.createElement('div')
        tempElement.innerHTML = content
        // 查找具有指定 data-comment-id 属性的元素
        var elementsToRemove = tempElement.querySelectorAll(
          '[data-comment-id="' + commentId + '"]'
        )
        // 从 DOM 中删除找到的元素
        elementsToRemove.forEach(function(element) {
          element.remove()
        })
        // 更新编辑器的内容
        editor.setContent(tempElement.innerHTML)
        commentDeleteCallback(commentId)
      }
    }

    // 显示批注标记
    function showCommentMark(comment) {
      const document = editor.getDoc()
      const mark = document.createElement('img')
      mark.setAttribute(DATA_COMMENT_ID, comment.commentId)
      mark.setAttribute(DATA_COMMENT_CONTENT, comment.comment)
      mark.setAttribute('id', comment.commentId)
      mark.classList.add('comment')
      mark.setAttribute('style', 'width: 24px; height: 24px; ')
      mark.setAttribute('src', require('./images/message.png'))
      editor.selection.setRng(comment.range)
      editor.selection.setNode(mark)
    }

    editor.on('init', () => {
      // 定义插件的按钮和菜单项
      editor.ui.registry.addButton('addcomment', {
        icon: 'comment-add',
        tooltip: '添加评论',
        onAction: function() {
          editor.execCommand('addComment')
        }
      })

      editor.ui.registry.addButton('showcomments', {
        icon: 'comment',
        tooltip: '显示所有评论',
        onAction: function() {
          editor.execCommand('showComments')
        }
      })

      editor.ui.registry.addButton('deletecomment', {
        icon: 'remove',
        tooltip: '删除评论',
        onAction: function() {
          editor.execCommand('deleteComment')
        }
      })

      editor.ui.registry.addButton('hideComment', {
        icon: 'preview',
        tooltip: '隐藏评论',
        onAction: function() {
          editor.execCommand('hideComment')
        }
      })

      // 添加插件按钮到工具栏
      editor.ui.registry.addGroupToolbarButton('comment', {
        icon: 'comment',
        tooltip: '评论',
        items: 'addcomment deletecomment | showcomments hideComment'
      })
    })

    let comments = []
    editor.on('NodeChange', (node) => {
      console.log(1)
      setTimeout(() => {
        const commentsNew = editor.dom.select(`.comment`).map((i) => {
          return i.getAttribute(DATA_COMMENT_ID)
        })
        comments.forEach((i) => {
          if (!commentsNew.includes(i)) {
            commentDeleteCallback(i)
          }
        })
        commentsNew.forEach(i => {
          if (!comments.includes(i)) {
            const comment = {
              commentId: i,
              comment: editor.dom.select(`[data-comment-id="${i}"]`)[0].getAttribute(DATA_COMMENT_CONTENT)
            }
            commentAddCallback(comment)
          }
        })
        comments = commentsNew
      }, 0)
    })

    // 添加样式
    editor.on('LoadContent', () => {
      editor.dom.addStyle(`
      .comment {
          display: inline-block !important;
          width: 24px;
          height: 24px;
          cursor: pointer;
          visibility: visible !important;
          background: url(${require('./images/message.png')}) no-repeat center / contain;
        }
      `)
    })
  })
})()
