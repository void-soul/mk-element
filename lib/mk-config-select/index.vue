<template>
  <el-select
    v-model="value_"
    :auto-complete="autoComplete"
    :automatic-dropdown="automaticDropdown"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :allow-create="allowCreate"
    :loading="loading"
    :popper-class="popperClass"
    :remote="remote"
    :loading-text="loadingText"
    :no-match-text="noMatchText"
    :no-data-text="noDataText"
    :remote-method="remoteMethod"
    :filter-method="filterMethod"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :placeholder="placeholder"
    :default-first-option="defaultFirstOption"
    :reserve-keyword="reserveKeyword"
    :value-key="valueKey"
    :collapse-tags="collapseTags"
    :popper-append-to-body="popperAppendToBody"
    @change="change"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
    @clear="clear"
    @blur="blur"
    @focus="focus"
  >
    <el-option v-if="mkEmpty" :label="mkEmptyLabel" :value="mkEmptyValue" />
    <el-option v-for="item in list" :key="item[0]" :label="item[1]" :value="item[0]" :disabled="_disable(item[0])" />
  </el-select>
</template>
<script>
export default {
  name: 'mk-config-select',
  props: {
    // data-config 名称,对应GlobalValues
    mkConfig: { type: String, required: true },
    // label值回传绑定属性,这是一个sync属性,例如：:mk-label.sync="form.continent"
    mkLabel: { type: String, required: false },
    // 哪些值禁用, GlobalValues 中的 value
    mkDisabled: { type: String },
    // 默认选中第一个？
    mkFirst: { type: Boolean, default: false },
    // 哪些值隐藏, GlobalValues 中的 value
    mkHidden: { type: String },
    // 哪些值显示, GlobalValues 中的 value
    mkFilter: { type: String },
    // 未选择时，是否展示mkEmptyLabel、mkEmptyValue？
    mkEmpty: { type: Boolean, default: true },
    // 未选择时显示的内容
    mkEmptyLabel: { type: String, default: '全部' },
    // 未选择时的值
    mkEmptyValue: { type: String, default: '' },

    value: {
      type: [String, Number]
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
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
        return this.$store.state.config.GlobalArray[this.mkConfig].filter((item) => !this._hidden(item[0]) && this._filter(item[0]));
      } else {
        return [];
      }
    }
  },
  watch: {
    value(vl) {
      this.value_ = vl;
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
    if (this.mkFirst === true && !this.value && this.$store.state.config.GlobalArray[this.mkConfig].length > 0) {
      this.change(this.$store.state.config.GlobalArray[this.mkConfig][0][0]);
    }
    this.value_ = this.value;
  },
  methods: {
    change(v) {
      const target = this.$store.state.config.GlobalArray[this.mkConfig].find((item) => item[0] === v);
      if (target && target.length > 1) {
        this.$emit('update:mkLabel', target[1]);
      } else {
        this.$emit('update:mkLabel', '');
      }

      this.$emit('input', v);
      this.$emit('change', v);
    },
    visibleChange(v) {
      this.$emit('visible-change', v);
    },
    removeTag(v) {
      this.$emit('remove-tag', v);
    },
    clear() {
      this.$emit('clear');
    },
    blur(event) {
      this.$emit('blur', event);
    },
    focus(event) {
      this.$emit('focus', event);
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
