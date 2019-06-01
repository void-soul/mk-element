<template>
  <el-row v-if="hr === false" :style="{ height: `${height}px` }" />
  <hr v-else />
</template>
<script>
export default {
  name: 'mk-hr',
  props: {
    hr: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 10
    }
  }
};
</script>
