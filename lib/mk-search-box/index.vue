<template>
  <div>
    <el-card v-if="title" style="margin-bottom:10px">
      <div slot="header" v-html="title" />
      <el-row
        class="dinbu-in"
        :class="{ 'dinbu-in-line': inline }"
        style="margin-bottom:0;background-color: #FFF"
      >
        <slot />
      </el-row>
    </el-card>
    <el-row v-else class="dinbu-in" :class="{ 'dinbu-in-line': inline }">
      <slot />
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'mk-search-box',
  props: {
    title: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  }
};
</script>
