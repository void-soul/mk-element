<template>
  <el-row class="bottom-tool-bar-footer" :style="{ 'text-align': align }">
    <slot />
  </el-row>
</template>
<script>
/**
 * 底部菜单
 */
export default {
  name: 'mk-bottom-box',
  props: {
    align: { type: String, default: 'center' }
  }
};
</script>
