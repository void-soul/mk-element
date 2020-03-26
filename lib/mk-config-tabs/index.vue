<template>
</template>
<script>
export default {
  name: 'mk-config-tabs',
  props: {
    // data-config 名称,对应GlobalValues
    mkConfig: { type: String, required: true },
    // 哪些值禁用, GlobalValues 中的 value
    mkDisabled: { type: String },
    // 哪些值隐藏, GlobalValues 中的 value
    mkHidden: { type: String },
    // 哪些值显示, GlobalValues 中的 value
    mkFilter: { type: String },
    // 未选择时显示的内容
    mkEmptyLabel: { type: String, default: '全部' },
    // 未选择时的值
    mkEmptyValue: { type: String, default: '' },

    value: {
      type: [String, Number]
    },
    type: String,
    stretch: {
      type: Boolean,
      default: true
    },
    tabPosition: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      disableds: [],
      hiddens: [],
      filters: [],
      value_: null
    };
  },
  computed: {
    list() {
      if (this.$store.state.config) {
        return this.$store.state.config.GlobalArray[this.mkConfig].filter(
          (item) => !this._hidden(item[0]) && this._filter(item[0])
        );
      } else {
        return [];
      }
    }
  },
  watch: {
    value(vl) {
      this.value_ = vl;
    },
    value_(vl) {
      this.$emit('input', vl);
    }
  },
  mounted() {
    if (this.mkDisabled) {
      this.disableds = this.mkDisabled.split(',');
    }
    if (this.mkHidden) {
      this.hiddens = this.mkHidden.split(',');
    }
    if (this.mkFilter) {
      this.filters = this.mkFilter.split(',');
    }
    this.value_ = this.value;
  },
  methods: {
    change(label) {
      this.$emit('change', label, this.value_);
    },
    _hidden(key) {
      return this.hiddens.indexOf(key) > -1;
    },
    _filter(key) {
      return this.filters.length === 0 || this.filters.indexOf(key) > -1;
    },
    _disable(key) {
      return this.disableds.indexOf(key) > -1;
    }
  }
};
</script>
