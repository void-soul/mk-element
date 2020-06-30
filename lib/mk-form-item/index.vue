<template>
  <el-popover v-if="mkTip"
              placement="top-start"
              width="210"
              trigger="click">
    <el-tag v-if="mkLeLength > realLength"
            type="warning"> 还能输入{{ mkLeLength - realLength }}个字,最多{{ mkLeLength }}个字 </el-tag>
    <el-tag v-else-if="mkLeLength < realLength"
            type="danger"> 多输了{{ realLength - mkLeLength }}个字,最多{{ mkLeLength }}个字 </el-tag>
    <el-tag v-else
            type="success"> 刚好是{{ mkLeLength }}个字 </el-tag>
    <el-form-item slot="reference"
                  ref="item"
                  :class="{ 'is-required': required }"
                  :label="label"
                  :label-width="realLabelWidth"
                  :prop="prop"
                  :rules="[{ validator: vil, trigger: mkTrigger }]"
                  :error="error"
                  :inline-message="inlineMessage"
                  :show-message="showMessage"
                  :size="size">
      <slot />
      <slot name="label"
            slot="label" />
    </el-form-item>
  </el-popover>
  <el-form-item v-else
                ref="item"
                :class="{ 'is-required': required }"
                :label="label"
                :label-width="realLabelWidth"
                :prop="prop"
                :rules="[{ validator: vil, trigger: mkTrigger }]"
                :error="error"
                :inline-message="inlineMessage"
                :show-message="showMessage"
                :size="size">
    <slot />
    <slot name="label"
          slot="label" />
  </el-form-item>
</template>
<script>
import { getPropByPath } from 'element-ui/lib/utils/util';
import { types, fns, inlays, getProp } from './patterns';
export default {
  name: 'mk-form-item',
  props: {
    label: String,
    labelWidth: String,
    prop: {
      type: String,
      default: '-'
    },
    required: {
      type: Boolean,
      default: undefined
    },
    error: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,

    // string、number、boolean类型声明
    mkType: {
      type: String,
      default: 'string',
      validator (vl) {
        return types.indexOf(vl) > -1;
      }
    },

    mkEq: [Number, String, Function],
    mkNe: [Number, String, Function],
    mkLt: [Number, String, Function],
    mkLe: [Number, String, Function],
    mkGe: [Number, String, Function],
    mkGt: [Number, String, Function],

    mkEqProp: String,
    mkNeProp: String,
    mkLtProp: String,
    mkLeProp: String,
    mkGeProp: String,
    mkGtProp: String,

    mkEqLength: [Number, String, Function],
    mkNeLength: [Number, String, Function],
    mkLtLength: [Number, String, Function],
    mkLeLength: [Number, String, Function],
    mkGeLength: [Number, String, Function],
    mkGtLength: [Number, String, Function],

    mkEqLengthProp: String,
    mkNeLengthProp: String,
    mkLtLengthProp: String,
    mkLeLengthProp: String,
    mkGeLengthProp: String,
    mkGtLengthProp: String,

    mkEnum: [Array, Function],
    // 内置正则
    mkInlay: {
      type: String,
      validator (vl) {
        return inlays.indexOf(vl) > -1;
      }
    },
    mkPattern: RegExp,
    mkCustom: Function,
    // 服务端验证，将把当前form对象整个传回去
    // 要求服务端是post提交,返回类型是string的错误信息
    // 返回空字符串或者null表示验证通过
    // 此时最好开启form的status-icon属性，这样延迟验证会有loading效果
    mkRemote: String,
    // 服务端验证默认将当前form全部字段传回服务器
    // 这里可以设置忽略哪些字段(仅支持form自己的字段，例如form.skuList[0].name,没法控制，只能忽略skuList)
    mkRemoteSkipField: Array,

    mkLabel: String,
    mkTarget: [Function, String],

    mkTrigger: { type: String, default: 'blur' },

    // 是否显示输入即时提示?目前仅支持长度
    mkTip: { type: Boolean, default: false }
  },
  computed: {
    realLabel () {
      return this.mkLabel || this.label || '';
    },
    realLabelWidth () {
      return this.label ? this.labelWidth : '0';
    },
    form () {
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      while (parentName !== 'ElForm') {
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      return parent;
    },
    fieldValue () {
      const model = this.form.model;
      if (!model || !this.prop) {
        return;
      }

      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }

      return getPropByPath(model, path, true).v;
    },
    realLength () {
      return `${ this.fieldValue || '' }`.length;
    }
  },
  methods: {
    async vil (rule, value, callback) {
      if (this.mkTarget !== undefined) {
        if (typeof this.mkTarget === 'function') {
          value = this.mkTarget();
        } else {
          value = getProp(this.mkTarget);
        }
      }
      for (const fn of fns) {
        const error = await fn.call(this, rule, value);
        if (error !== null && error !== undefined) {
          callback(error);
          break;
        }
      }
      callback();
    }
  }
};
</script>
