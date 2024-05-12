<template>
  <div class="page">
    <div class="editor-section">
      <!-- 编辑器 -->
      <Editor ref="editor" v-model="myValue" class="editor" :init="init" />
      <!-- 评论区 -->
      <div v-if="showComment" class="comments-area">
        <div class="comments-area-title">
          <i class="el-icon-chat-dot-round" />
          <span>评论</span>
          <i
            class="el-icon-close"
            name="CloseCircle"
            color="#fff"
            @click="onCloseCommentArea"
          />
        </div>
        <div class="comments-area-content">
          <CommentTree
            v-for="node in commentTree"
            :id="node.commentId"
            ref="commentTree"
            :key="node.commentId"
            :node="node"
            :margin="0"
            class="comments-area-comment"
            :selecteds="selecteds"
            @reply="onReply"
            @click="() => clickComment(node.commentId)"
          />
        </div>
      </div>
    </div>

    <br>

    <el-button @click="onSubmit">submit</el-button>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import CommentTree from '@/tinymce/plugins/comment/CommentTree.vue'

// TinyMCE so the global var exists
import 'tinymce/tinymce'
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'
// Editor styles
import 'tinymce/skins/ui/oxide/skin'

// plugins
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/help/js/i18n/keynav/en'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/accordion'

// My custom plugin
import '@/tinymce/plugins/comment/index'

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis'

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content'
import 'tinymce/skins/ui/oxide/content'

const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

// tinye options
const INIT_OPTIONS = {
  license_key: 'gpl',
  plugins:
    'comment preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
  editimage_cors_hosts: ['picsum.photos'],
  menubar: 'file edit view insert format tools table help',
  toolbar:
    'comment | undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: true,
  link_list: [
    { title: 'My page 1', value: 'https://www.tiny.cloud' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_list: [
    { title: 'My page 1', value: 'https://www.tiny.cloud' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_class_list: [
    { title: 'None', value: '' },
    { title: 'Some class', value: 'class-name' }
  ],
  importcss_append: true,
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'floating',
  contextmenu: 'link image table',
  skin: useDarkMode ? 'oxide-dark' : 'oxide',
  content_css: useDarkMode ? 'dark' : 'default',
  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
}

export default {
  name: 'Dashboard',
  components: {
    Editor,
    CommentTree
  },
  data() {
    return {
      myValue: '<p>123123<img id="comment_1715485739388" class="comment" style="width: 24px; height: 24px;" src="static/img/message.9cc1d923.png" data-comment-id="comment_1715485739388" data-comment-content="1"></p>',
      init: {
        ...INIT_OPTIONS,
        comment_events: {
          add: this.onAddComment,
          delete: this.onDeleteComment,
          show: this.onShowComment,
          hide: this.onHideComment
        }
      },
      commentTree: [
        { commentId: 'comment_1715485739388', comment: '1' }
      ],
      selecteds: [],
      showComment: true
    }
  },
  methods: {
    onShowComment(commentId) {
      this.showComment = true
      this.$nextTick(() => {
        this.$refs.commentTree.forEach((i) => {
          if (i.node.commentId === commentId) {
            i.$el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            this.selecteds = [commentId]
          }
        }
        )
      })
    },
    onHideComment() {
      this.showComment = false
    },
    onAddComment(comment) {
      if (!this.commentTree.find(i => i.commentId === comment.commentId)) {
        this.commentTree.push({
          commentId: comment.commentId,
          comment: comment.comment,
          createTime: new Date().toLocaleString()
        })
        this.showComment = true
        this.selecteds = [comment.commentId]
      }
    },
    onDeleteComment(commentId) {
      this.commentTree = this.commentTree.filter((i) => commentId !== i.commentId)
    },
    onCloseCommentArea() {
      this.showComment = false
    },
    clickComment(commentId) {
      this.selecteds = [commentId]
      this.$refs.editor.editor.execCommand('selectedComment', commentId)
    },
    bfsInsertChild(targetCommentId, newChild) {
      const queue = [...this.commentTree]

      while (queue.length) {
        const currentNode = queue.shift()

        // 如果找到目标节点，就在其 children 中插入新子节点
        if (currentNode.commentId === targetCommentId) {
          if (!currentNode.children) {
            currentNode.children = []
          }
          currentNode.children.push(newChild) // 插入新子节点
          return // 插入完成后结束搜索
        }

        if (currentNode.children && currentNode.children.length) {
          queue.push(...currentNode.children) // 将子节点加入队列继续遍历
        }
      }
      this.commentTree.push(queue)
    },
    onReply(e) {
      this.bfsInsertChild(e.parentCommentId, {
        parentCommentId: e.parentCommentId,
        commentId: new Date().getTime(),
        comment: e.comment,
        createTime: new Date().toLocaleString()
      })
    },
    onSubmit() {
      console.log(this.myValue)
      console.log(this.commentTree)
    }
  }
}
</script>

<style lang="scss" scoped>

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.editor-section {
  position: relative;
  width: 80%;
  margin: 0 auto;
}
.editor {
  width: 100%;
}
.comments-area {
  position: absolute;
  top: 2px;
  bottom: 2px;
  right: 2px;
  z-index: 9;
  width: 400px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  .comments-area-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #409eff;
    color: #fff;
    .close-btn {
      cursor: pointer;
    }
  }
  .comments-area-content {
    flex: 1;
    overflow-y: auto;
  }
  .comments-area-comment {
    padding: 10px;
  }
}
</style>
