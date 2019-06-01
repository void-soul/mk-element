<template>
  <el-row :tag="tag" :gutter="gutter" :type="type" :justify="justify" :align="align">
    <el-col v-if="left" :span="border" style="opacity: 0;">
      .
    </el-col>
    <el-col :span="24 - (left ? border : 0) - (right ? border : 0)">
      <slot />
    </el-col>
    <el-col v-if="right" :span="border" style="opacity: 0;">
      .
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'mk-row',
  props: {
    border: {
      type: Number,
      default: 4
    },
    left: {
      type: Boolean,
      default: true
    },
    right: {
      type: Boolean,
      default: true
    },
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  }
};
</script>
