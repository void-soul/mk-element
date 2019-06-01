<template>
  <component :is="tag" v-if="vif" style="display:inline">
    <slot />
  </component>
</template>
<script>
/**
 * 权限组件
 * 将需要权限管理的内容括起来
 */
export default {
  name: 'mk-auth',
  props: {
    // 容器名称
    tag: {
      type: String,
      default: 'div'
    },
    // 权限编码
    code: {
      type: [String, Array],
      required: true
    },
    // 反转？
    reverse: {
      type: Boolean,
      required: false
    },
    // 全部满足？or全部不满足(当反转时)？
    all: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    vif() {
      // 菜单编码
      const codes = Array.isArray(this.code) ? this.code : [this.code];

      // 若all=true,找到一个false的则表示找到了
      // 若all=false,找到一个true的则表示找到了
      const findIt = codes.findIndex((code) => this.auth(code) !== this.all) !== -1;
      // 若all=true,找到表示没权限
      // 若all=false,找到表示有权限
      const hasRole = findIt !== this.all;
      // 若正常,有权限表示显示
      // 若反转,有权限表示不显示
      return this.reverse !== hasRole;
    }
  },
  methods: {
    auth(checkcode) {
      const index = this.$store.state.dataPermission.findIndex((ele) => ele === checkcode);
      return index > -1;
    }
  }
};
</script>
