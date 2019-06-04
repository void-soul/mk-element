<template>
  <div
    :style="{
      marginLeft: gutter + 'px',
      display: 'inline-block',
      width: tab === true ? '' : 'auto'
    }"
  >
    <el-popover
      ref="apopover"
      v-model="apopovervisible"
      :placement="confirmPlacement"
      width="160"
    >
      <p v-if="confirmText" style="color:#000;" v-html="confirmText" />
      <div style="text-align: right; margin: 0;">
        <el-button size="mini" type="text" @click="apopovervisible = false">
          {{ confirmCancelText }}
        </el-button>
        <el-button type="primary" size="mini" @click="ck1">
          {{ confirmOkText }}
        </el-button>
      </div>
    </el-popover>
    <el-button
      v-if="confirmText"
      v-popover:apopover
      :class="cls"
      :disabled="disabled"
      :loading="loading"
      :autofocus="autofocus"
      :icon="icon"
      :type="type === 4 ? 'text' : ''"
      size="small"
      :circle="circle"
      :style="{
        padding: padwidth + 'px',
        paddingLeft: padwidth + 'px'
      }"
    >
      <slot />
    </el-button>
    <el-button
      v-else
      :class="cls"
      :disabled="disabled"
      :loading="loading"
      :autofocus="autofocus"
      :icon="icon"
      :type="type === 4 ? 'text' : ''"
      size="small"
      :circle="circle"
      :style="{
        padding: padwidth + 'px',
        paddingLeft: padwidth + 'px'
      }"
      @click="ck"
    >
      <slot />
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'mk-button',
  props: {
    disabled: { type: Boolean, default: false },
    type: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    icon: { type: String, default: '' },
    tab: { type: Boolean, default: false },
    size: { type: Number, default: 1 },
    confirmText: { type: String, default: '' },
    confirmText2: { type: String, default: '' },
    confirmText3: { type: String, default: '' },
    confirmOkText: { type: String, default: '确定' },
    confirmCancelText: { type: String, default: '取消' },
    confirmPlacement: { type: String, default: 'top' },
    padwidth: { type: Number, default: null },
    gutter: { type: Number, default: 4 },
    circle: { type: Boolean, default: false }
  },
  data() {
    return {
      apopovervisible: false
    };
  },
  computed: {
    cls() {
      return {
        but2: this.type === 0,
        'btn-bgwhate': this.type === 0 || this.type === 1,
        but3: this.type === 1,
        'btn-tabactive': this.tab === true && this.type === 1,
        blue: this.type === 2,
        'btn-bgblue': this.type === 2 || this.type === 3,
        bgblue: this.type === 2,
        gray: this.type === 3,
        'btn-bggray': this.type === 3,
        'btn-tab': this.tab === true,
        'btn-smallbutton': this.size === 0,
        'btn-nopadding': this.type === 5
      };
    }
  },
  methods: {
    ck1() {
      this.apopovervisible = false;
      this.ck();
    },
    ck() {
      if (
        (!this.confirmText2 ||
          (this.confirmText2 && confirm(this.confirmText2))) &&
        this.loading === false
      ) {
        if (this.confirmText3) {
          this.$prompt(
            `<span style="color:#ff0000;font-weight:bolder">${
              this.confirmText3
            }</span>`,
            '为了防止误操作,请输入以下文字',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              inputPattern: new RegExp(`^${this.confirmText3}$`),
              inputErrorMessage: '输入错误'
            }
          )
            .then(({ value }) => {
              this.$emit('click');
            })
            .catch(() => {});
        } else {
          this.$emit('click');
        }
      }
    }
  }
};
</script>
