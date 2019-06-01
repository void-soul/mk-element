<template>
  <div
    v-if="img"
    :style="{
      width: `${mini === true ? miniWidth : maxWidth}px`,
      height: `${mini === true ? miniHeight : maxHeight}px`
    }"
  >
    <img
      v-if="mini === true && hoverMax === false && visible"
      :src="src"
      :style="{
        width: `${miniWidth}px`,
        height: `${miniHeight}px`,
        border: 'none'
      }"
      @error="error"
    />
    <el-popover v-else-if="mini === true && hoverMax === true" trigger="hover" placement="right">
      <img
        v-if="visible"
        :src="src"
        :style="{
          width: `${maxWidth}px`,
          height: `${maxHeight}px`,
          border: 'none'
        }"
        @error="error"
      />
      <div slot="reference" style=" display: flex;flex-direction: row;justify-content:center;align-items:center;">
        <img
          v-if="visible"
          :src="src"
          :style="{
            width: `${miniWidth}px`,
            height: `${miniHeight}px`,
            border: 'none'
          }"
          @error="error"
        />
      </div>
    </el-popover>
    <img
      v-if="mini === false && visible"
      :src="src"
      :style="{
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
        border: 'none'
      }"
      @error="error"
    />
  </div>
</template>
<script>
export default {
  name: 'mk-img-view',
  props: {
    img: { type: String },
    def: { type: String, default: '//static.emeker.com/common/nopic.png' },
    mini: { type: Boolean, default: false },
    hoverMax: { type: Boolean, default: false },
    miniWidth: { type: Number, default: 20 },
    miniHeight: { type: Number, default: 20 },
    maxWidth: { type: Number, default: 150 },
    maxHeight: { type: Number, default: 150 }
  },
  data() {
    return {
      visible: true,
      src: null
    };
  },
  watch: {
    img: function() {
      this.src = this.img || this.def;
    }
  },
  created() {
    this.src = this.img || this.def;
  },
  methods: {
    error() {
      this.src = this.def;
    }
  }
};
</script>
