<template>
  <el-card :shadow="shadow" :body-style="bodyStyle" :class="extendClass">
    <template slot="header">
      <div v-if="mkCardType === 'simply'">
        <slot name="header">
          {{ header }}
        </slot>
        <i
          v-if="mkBodySwitch && mkCardType === 'simply'"
          v-show="vif"
          class="el-icon-arrow-up"
          @click="vif = false"
        />
        <i
          v-if="mkBodySwitch && mkCardType === 'simply'"
          v-show="!vif"
          class="el-icon-arrow-down"
          @click="vif = true"
        />
      </div>
      <slot v-else name="header">
        <div>
          {{ header }}
        </div>
      </slot>
    </template>
    <slot v-if="mkBodyVif && vif" />
  </el-card>
</template>
<script>
export default {
  name: 'mk-card',
  props: {
    header: {
      type: String
    },
    shadow: {
      type: String,
      default: 'always'
    },
    mkCardType: {
      type: String,
      default: ''
    },
    mkBodyPadding: {
      type: Number,
      default: 0
    },
    mkBodyVif: {
      type: Boolean,
      default: true
    },
    mkBodySwitch: {
      type: Boolean,
      default: false
    },
    mkBodyVifStart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      vif: true
    };
  },
  computed: {
    bodyStyle() {
      return { padding: `${this.mkBodyPadding}px` };
    },
    extendClass() {
      return {
        'mk-card-simply': this.mkCardType === 'simply',
        'mk-card-line': this.mkCardType === 'line'
      };
    }
  },
  created() {
    this.vif = this.mkBodyVifStart;
  }
};
</script>
