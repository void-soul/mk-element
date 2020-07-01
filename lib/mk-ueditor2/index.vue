<template>
  <div v-loading="spinShow"
       :element-loading-text="progress ? `上传中,进度${progress}%`: ''"
       element-loading-spinner="el-icon-loading">
    <div ref="editor"></div>
  </div>
</template>
<script>
import ClassicEditor from './lib/ckeditor.js';

export default {
  name: 'UE',
  data () {
    return {
      edit: null,
      spinShow: true,
      progress: 0
    };
  },
  props: {
    token: {
      type: Function,
      default: null
    },
    uploadAction: {
      type: String,
      default: null
    },
    viewAction: {
      type: String,
      default: null
    },
    fileFolder: {
      type: String,
      default: ''
    }
  },
  async mounted () {
    this.$nextTick(async () => {
      this.edit = await ClassicEditor.create(this.$refs.editor, {
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            'fontFamily',
            '|',
            'highlight',
            'strikethrough',
            'underline',
            'subscript',
            'superscript',
            '|',
            'indent',
            'outdent',
            'alignment',
            '|',
            'insertImage',
            'insertVideo',
            'link',
            '|',
            'insertTable',
            'horizontalLine',
            'blockQuote',
            'numberedList',
            'bulletedList',
            '|',
            'removeFormat',
            'undo',
            'redo'
          ]
        },
        language: 'zh-cn',
        image: {
          toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties'
          ]
        },
        upload: {
          token: async () => {
            return await this.token();
          },
          action: this.uploadAction,
          viewAction: this.viewAction,
          fileFolder: this.fileFolder,
          debug: false,
          progress: (progress) => {
            this.progress = progress;
          },
          start: () => {
            this.spinShow = true;
            this.progress = 0;
          },
          fail: (msg) => {
            this.spinShow = false;
            this.progress = 0;
            this.$message(msg);
            this.$emit('fail', msg);
          },
          success: () => {
            this.spinShow = false;
            this.progress = 0;
          }
        }
      });
      this.$emit('loaded');
      this.spinShow = false;
    });
  },
  methods: {
    set (content) {
      if (this.edit) {
        this.edit.setData(content);
      }
    },
    get () {
      if (this.edit) {
        return this.edit.getData();
      }
    }
  },
  async beforeDestroy () {
    if (this.edit) {
      await this.edit.destroy();
      this.edit = null;
    }
  }
};
</script>
