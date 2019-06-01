<template>
  <el-row>
    <slot v-if="show" />
    <div v-else :style="{ height: `${height}px` }" />
  </el-row>
</template>
<script>
// 延迟渲染的组件必定占一行
// so将需要同一行需要渲染的组件放在一行!
export default {
  name: 'mk-lazy-render',
  props: {
    height: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      show: false,
      threshold: -10,
      io: null
    };
  },
  created() {
    if (!process.server) {
      this.io = new window.IntersectionObserver(this.intersectionHandler, {
        rootMargin: `${this.threshold}px 0px`,
        threshold: [0, Number.MIN_VALUE, 0.01]
      });
    }
    this.$nextTick(() => {
      if (this.$slots.default && this.$slots.default.nodeName !== '#comment') {
        this.io.observe(this.$el);
      }
    });
  },
  beforeDestroy() {
    this.disconnect();
  },
  methods: {
    intersectionHandler(entries) {
      if (
        // 正在交叉
        entries[0].isIntersecting ||
        // 交叉率大于0
        entries[0].intersectionRatio
      ) {
        this.init();
      }
    },
    init() {
      // 由于函数会在主线程中执行，加载懒加载组件非常耗时，容易卡顿
      // 所以在requestAnimationFrame回调中延后执行
      window.requestAnimationFrame(() => {
        this.show = true;
        // 组件显示吗?
        // 渲染后，取消监听事件
        this.disconnect();
      });
    },
    disconnect() {
      if (this.io) {
        this.io.disconnect();
        this.io = null;
      }
    }
  }
};
</script>
