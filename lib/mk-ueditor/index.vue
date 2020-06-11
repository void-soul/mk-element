<template>
  <div v-loading="spinShow" element-loading-text="组件加载中..." element-loading-spinner="el-icon-loading">
    <textarea :id="id" ref="area" v-model="value"></textarea>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern';
import './tinymce/langs/zh_CN';
import './tinymce/plugins/uploadimage';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/print';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/code';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/save';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/table';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/visualchars';

import 'tinymce/skins/lightgray/skin.min.css';

export default {
  name: 'UE',
  data() {
    return {
      editor: null,
      id: 'F' + Number(new Date()) + parseInt(Math.random() * 100, 10),
      spinShow: true
    };
  },
  props: {
    compress: {
      type: Number,
      default: 1
    },
    value: {
      type: String,
      default: ''
    },
    simply: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: null
    },
    // 如果指定此token，则不再上传到 /file/upload/wang.html
    // 而是upload.emeker.com
    token: {
      type: String,
      default: null
    },
    uploadAction: {
      type: String,
      default: null
    },
    uploadParam: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const options = {
      selector: `#${this.id}`,
      skin: false,
      branding: false,
      elementpath: false,
      width: '99%',
      height: this.height,
      theme: 'modern',
      language: 'zh_CN',
      setup: (editor) => {
        editor.on('init', (e) => {
          this.spinShow = false;
          editor.setContent(this.value);
        });
      },
      init_instance_callback: (editor) => {
        editor.on('Change', (e) => {
          this.$emit('input', editor.getBody().innerHTML);
          this.$emit('change');
        });
      }
    };
    if (this.simply === true) {
      options.statusbar = false;
      options.menubar = false;
      options.plugins = ['lists textcolor'];
      options.toolbar1 = 'bullist | undo redo | forecolor strikethrough  backcolor bold italic styleselect';
    } else {
      options.menubar = 'edit insert view format table tools';
      options.plugins = [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'template paste textcolor colorpicker textpattern imagetools toc help emoticons hr uploadimage'
      ];
      options.toolbar1 = 'fullscreen | preview | undo redo | styleselect | forecolor strikethrough  backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | uploadimage';
      options.autosave_interval = '20s';
      options.image_advtab = true;
      options.table_default_styles = {
        width: '100%',
        borderCollapse: 'collapse'
      };
      options.upload = {
        url: this.uploadAction || (this.token ? 'https://upload.emeker.com/upload' : '/file/upload/wang.html'),
        compress: this.compress,
        token: this.token,
        view: 'https://upload.emeker.com',
        param: this.uploadParam
      };
    }
    this.$nextTick(() => {
      tinymce.init(options);
      this.$refs.area.change = () => {
        this.$emit('input', tinymce.get(this.id).getBody().innerHTML);
        this.$emit('change');
      };
    });
  },
  methods: {
    setContent(content) {
      tinymce.get(this.id).setContent(content);
    }
  },
  beforeDestroy() {
    tinymce.get(this.id).destroy(true);
  }
};
</script>
