<script>
export default {
  name: 'ElTag',
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String
  },
  computed: {
    tagSize() {
      return this.size || (this.$ELEMENT || {}).size;
    }
  },
  methods: {
    handleClose(event) {
      event.stopPropagation();
      this.$emit('close', event);
    },
    handleClick(event) {
      // event.stopPropagation();
      this.$emit('click', event);
    }
  },
  render(h) {
    const classes = ['el-tag', this.type ? `el-tag--${this.type}` : '', this.tagSize ? `el-tag--${this.tagSize}` : '', { 'is-hit': this.hit }];
    const tagEl = (
      <span class={classes} style={{ backgroundColor: this.color }} on-click={this.handleClick}>
        {this.$slots.default}
        {this.closable && <i class='el-tag__close el-icon-close' on-click={this.handleClose} />}
      </span>
    );

    return this.disableTransitions ? tagEl : <transition name='el-zoom-in-center'>{tagEl}</transition>;
  }
};
</script>
