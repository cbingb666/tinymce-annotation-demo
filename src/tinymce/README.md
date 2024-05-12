## Props

- `node` (Object, required): 包含评论信息的对象，必须包含以下字段：
  - `commentId`: 评论的唯一标识符。
  - `parentCommentId`: 父评论的唯一标识符，如果没有父评论则为 null。
  - `username`: 评论者的用户名。
  - `createTime`: 评论创建时间。
  - `comment`: 评论的内容。
  - `children`: 包含回复评论的子评论数组。

- `maxLevel` (Number, default: 3): 最大嵌套层级，用于限制评论的最大嵌套深度。

- `level` (Number, default: 1): 当前评论在评论树中的层级。

## Events

- `isTreeReply`: 当组件被用作回复时触发的事件。
- `reply`: 当用户提交回复时触发的事件，回传回复的内容及父评论的信息。
- `scrollToComment`: 当用户点击评论标题时触发的事件，用于滚动到指定评论处。

## Methods

- `high`: 控制台输出当前节点的引用。

## 使用示例

```vue
<template>
  <div>
    <CommontTree :node="commentData" />
  </div>
</template>

<script>
import CommontTree from './CommontTree.vue';

export default {
  components: {
    CommontTree
  },
  data() {
    return {
      commentData: {
        // 评论数据对象
      }
    };
  }
};
</script>