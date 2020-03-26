<template>
  <el-dialog :title="title"
             :class="{'no-header':mkNoHeader}"
             :modal="modal"
             :visible="visible"
             :modal-append-to-body="modalAppendToBody"
             :append-to-body="appendToBody"
             :lock-scroll="lockScroll"
             :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnPressEscape"
             :show-close="showClose"
             :width="width"
             :fullscreen="fullscreen"
             :custom-class="customClass"
             :top="top"
             :before-close="beforeClose"
             :center="center"
             @open="open"
             @close="close"
             @closed="closed">
    <slot name="title"
          slot="title">
    </slot>
    <slot name="footer"
          slot="footer">
    </slot>
    <slot></slot>
  </el-dialog>
</template>
<script>
export default {
  name: 'mk-dialog',
  props: {
    mkNoHeader: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closed() {
      this.$emit('closed');
    },
    open() {
      this.$emit('open');
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>
