<template>
  <div class="comment-box">
    <div ref="node" class="comment-node" :class="{'selected': selected}" @click="$emit('click')">
      <div class="comment-title">
        <i
          :class="node.parentCommentId ? 'el-icon-upload2' : 'el-icon-chat-round'"
        />
        由
        <span class="username">
          {{ node.username || "匿名用户" }}
        </span>
        于 <span class="time">{{ node.createTime }} </span>
        {{ node.parentCommentId? "回复":"评论" }}
      </div>
      <div class="comment-content">{{ node.comment }}</div>
      <div v-if="level < maxLevel" class="comment-tool">
        <i class="el-icon-chat-dot-square icon-reply" @click="openReply()" />
      </div>
      <div v-if="replyFlag" ref="reply" class="reply">
        <el-input v-model="replyContent" class="reply-input" type="textarea" @click.stop.native />
        <el-button
          size="mini"
          round
          @click="reply({
            parentCommentId: node.commentId,
            comment: replyContent
          })"
        >回复</el-button>
      </div>
      <div v-if="node.children">
        <CommontTree
          v-for="child in node.children"
          ref="commentTree"
          :key="child.commentId"
          :level="level + 1"
          :max-level="maxLevel"
          :node="child"
          @isTreeReply="isTreeReply"
          @reply="reply"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommontTree',
  props: {
    node: {
      type: Object,
      required: true
    },
    selecteds: {
      type: Array,
      default: () => []
    },
    maxLevel: {
      type: Number,
      default: 3
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      replyContent: '',
      replyFlag: false
    }
  },
  computed: {
    selected() {
      return this.selecteds.includes(this.node.commentId)
    }
  },
  methods: {
    isTreeReply() {
      this.$emit('isTreeReply')
    },
    openReply() {
      const nextVal = !this.replyFlag
      this.replyFlag = nextVal
      nextVal && this.$nextTick(() => {
        this.$refs.reply.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    },
    reply({ parentCommentId, comment }) {
      this.replyContent = ''
      this.$emit('reply', {
        parentCommentId,
        comment
      })
      this.replyFlag = false
      this.$nextTick(() => {
        this.$refs.commentTree[this.$refs.commentTree.length - 1].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  padding: 0 10px 10px;
  .selected {
    box-shadow: 0 0 12px 0  #409eff;
  }
}

.comment-node {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.comment-title {
  background-color: rgb(245, 247, 250);
  padding: 8px 8px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  i {
    margin-right: 4px;
  }
  .username {
    color: #409eff;
    margin: 0 4px;
  }
  .time {
    margin: 0 4px;
    color: #909399;
  }
}

.comment-content {
  margin: 10px 20px;
  /* padding-top: 8px;
    padding-bottom: 8px; */
  padding-right: 8px;
  width: auto;
}

.comment-tool {
  display: flex;
  justify-content: flex-end;
  padding: 0 8px 8px;
  .icon-reply {
    color: #409eff;
    cursor: pointer;
  }
}

.reply {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 8px 8px;
  .reply-input {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 8px;
  }
}
</style>
