<template>
  <div class="comment-box">
    <div class="comment-tree" :style="{ marginLeft: `${margin}px` }">
      <div class="comment-title" @click="scrollToComment(node.commentId)">
        <Icon
          :name="node.parentCommentIndex == 0 ? 'Comment' : 'CommentReply'"
          :color="'#1296db'"
          style="
            width: 18px;
            height: 18px;
            display: inline-block;
            margin: 0 10px;
          "
        />
        <!-- <span>
                  #{{ node.cid ? node.cid : NaN }} &nbsp
              </span> -->
        <span style="font-weight: 600">
          {{ node.title }}
        </span>
        由
        <span style="font-weight: 600">
          {{ node.createUserName }}
        </span>
        于 <span style="font-weight: 600">{{ node.createTime }} </span>
        {{ node.parentCommentId == "comment_0" ? "评注" : "回复" }}
      </div>
      <div class="comment-content">{{ node.comment }}</div>
      <el-icon
        style="float: right; color: green; margin-right: 5px; top: -20px"
        @click="openReply()"
      >
        <ChatDotSquare />
      </el-icon>
      <el-input
        v-if="replyFlag"
        v-model="node.reply"
        type="textarea"
      />
      <div v-if="node.treeStructure">
        <docComments
          v-for="child in node.treeStructure"
          ref="commentTreeRefs"
          :key="child"
          :node="child"
          :margin="margin + 10"
          @isTreeReply="isTreeReply"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentBox',
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    margin: {
      type: Number,
      default: 0
    }
  },
  data: () => ({

  }),
  methods: {

  }
}
// import { ref, watch } from 'vue';
// import Icon from "@/components/Icon.vue"; // 引入图标库

// const emit = defineEmits(['isTreeReply', 'scrollToComment'])
// const isTreeReply = () => {
//   emit('isTreeReply')
// }
// const replyContent = ref<string>('')
// const replyParentId = ref<number>()
// const replyFlag = ref<boolean>(false)
// const openReply = () => {
//   replyFlag.value = !replyFlag.value;
// }
// const scrollToComment = (id: string) => {
//   emit('scrollToComment', id)
// }
// const commentTreeRefs = ref()
</script>
<style scoped>
.comment-box {
  padding: 10px;
}

.comment-tree {
  margin: 5px;
}

.comment-title {
  background-color: rgb(245, 247, 250);
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  width: auto;
  cursor: pointer;
}

.comment-content {
  margin: 10px 20px;
  /* padding-top: 8px;
  padding-bottom: 8px; */
  padding-right: 8px;
  width: auto;
}
</style>
