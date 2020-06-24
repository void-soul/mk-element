<template>
  <div v-if="img"
       :style="{
      width: `${mini === true ? miniWidth : maxWidth}px`,
      height: `${mini === true ? miniHeight : maxHeight}px`
    }">
    <template v-if="mini === true && hoverMax === false && visible">
      <img v-for="(item, index) in src"
           :key="index"
           :src="item"
           :style="{
        width: `${miniWidth}px`,
        height: `${miniHeight}px`,
        border: 'none'
      }"
           @click="show(index)"
           @error="errorHandel(index)" />
    </template>
    <template v-else-if="mini === true && hoverMax === true">
      <el-popover v-for="(item, index) in src"
                  :key="index"
                  trigger="hover"
                  placement="right">
        <img v-if="visible"
             :src="item"
             :style="{
          width: `${maxWidth}px`,
          height: `${maxHeight}px`,
          border: 'none'
        }"
             @error="errorHandel(index)" />
        <div slot="reference"
             style=" display: flex;flex-direction: row;justify-content:center;align-items:center;">
          <img v-if="visible"
               :src="item"
               :style="{
            width: `${miniWidth}px`,
            height: `${miniHeight}px`,
            border: 'none'
          }"
               @error="errorHandel(index)" />
        </div>
      </el-popover>
    </template>
    <template v-else-if="mini === false && visible">
      <img v-for="(item, index) in src"
           :key="index"
           :src="item"
           :style="{
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
        border: 'none'
      }"
           @click="show(index)"
           @error="errorHandel(index)" />
    </template>

    <viewer v-if="view"
            :images="src"
            @inited="initedViewer"
            :options="viewOptions"
            class="viewer"
            ref="viewer">
      <template slot-scope="scope">
        <img v-for="(img, index) in src"
             :src="img"
             style="display:none"
             :key="index">
        {{scope.options}}
      </template>
    </viewer>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';
import Vue from 'vue';
Vue.use(Viewer);
export default {
  name: 'mk-img-view',
  props: {
    img: { type: String },
    def: { type: String, default: '//static.emeker.com/common/nopic.png' },
    mini: { type: Boolean, default: false },
    hoverMax: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    miniWidth: { type: Number, default: 20 },
    miniHeight: { type: Number, default: 20 },
    maxWidth: { type: Number, default: 150 },
    maxHeight: { type: Number, default: 150 }
  },
  data () {
    return {
      visible: true,
      error: [],
      viewOptions: {
        initialViewIndex: 0,
        zIndex: 92015
      }
    };
  },
  computed: {
    src () {
      if (!this.img) {
        return [this.def];
      } else {
        return this.img.split(',').map((item, index) => {
          return this.error[index] ? this.def : item;
        });
      }
    }
  },
  methods: {
    initedViewer (viewer) {
      this.$viewer = viewer;
    },
    errorHandel (index) {
      this.error[index] = true;
    },
    show (index) {
      if (this.view && this.$viewer) {
        this.$viewer.show();
        this.$viewer.view(index);
      }
    }
  },
  beforeDestroy () {
    if (this.$viewer) {
      this.$viewer.destroy();
    }
  }
};
</script>
<style lang="scss" scoped>
.viewer {
  display: none;
}
</style>
