<template>
  <div ref="box" v-cloak>
    <el-upload
      :action="action"
      :headers="headers"
      :data="data"
      :name="name"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :on-preview="handlePreviewFun"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="onError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :before-remove="beforeRemove"
      :list-type="listType"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :http-request="upload"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="onExceed"
      ref="uploader"
    >
      <i class="el-icon-plus" v-if="listType === 'picture-card'"></i>
      <mk-button :type="0" icon="el-icon-plus" slot="trigger" v-else>{{
        mkChooseFileBtn
      }}</mk-button>
      <mk-button
        :type="2"
        icon="el-icon-upload2"
        v-if="autoUpload === false"
        @click="submit"
        >{{ mkUploadBtn }}</mk-button
      >
      <div slot="tip" class="el-upload__tip" v-if="mkTip">{{ mkTip }}</div>
    </el-upload>
    <el-dialog
      :visible="dialogVisible"
      v-if="mkPreview"
      append-to-body
      title="预览图片"
      @close="dialogVisible = false"
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import ElUpload from '../upload/index.vue';
import ajax from '../upload/ajax';
import mime from 'mime';
export default {
  name: 'mk-upload',
  components: {
    ElUpload
  },
  props: {
    action: {
      type: String,
      default: '/file/upload/common.html'
    },
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    multiple: Boolean,
    data: Object,
    withCredentials: {
      type: Boolean,
      default: true
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    accept: String,
    onPreview: {
      type: Function
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    onSuccess: Function,
    onError: Function,
    onProgress: Function,
    onChange: Function,
    beforeUpload: Function,
    beforeRemove: Function,
    listType: {
      type: String,
      default: 'text'
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: Number,
    onExceed: Function,
    value: {
      type: String
    },
    mkTip: {
      type: String
    },
    mkWidth: {
      type: Number,
      default: 0
    },
    mkHeight: {
      type: Number,
      default: 0
    },
    mkWidthShow: {
      type: Number,
      default: 148
    },
    mkHeightShow: {
      type: Number,
      default: 148
    },
    mkPreview: {
      type: Boolean,
      default: false
    },
    mkDownLoad: {
      type: Boolean,
      default: false
    },
    mkMaxFileSize: {
      type: Number,
      default: 0
    },
    mkChooseFileBtn: {
      type: String,
      default: '选择文件'
    },
    mkUploadBtn: {
      type: String,
      default: '开始上传'
    },
    mkFileTypes: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: null,
      handlePreviewFun: null
    };
  },
  computed: {
    fileList() {
      if (this.value) {
        const list = this.value.split(',');
        return list.map((url) => {
          if (url.indexOf('http:/') > -1 || url.indexOf('https:/') > -1) {
            return {
              name: +new Date(),
              url: `${url}`
            };
          } else {
            return {
              name: +new Date(),
              url: `${window.location.origin}${url}`
            };
          }
        });
      } else {
        return [];
      }
    }
  },
  watch: {
    value: {
      handler() {
        this.changeCard();
      },
      immediate: true
    }
  },
  methods: {
    clearFiles() {
      this.$refs.uploader.clearFiles();
    },
    abort() {
      this.$refs.uploader.abort();
    },
    submit() {
      this.$refs.uploader.submit();
    },
    handlePreview(file) {
      if (this.mkPreview === true) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
      if (this.mkDownLoad === true) {
        window.open(file.url);
      }
    },
    convertFile(fileList) {
      // if (this.multiple === false) {
      //   return fileList.length > 0
      //     ? fileList[0].url.replace(window.location.origin, '')
      //     : '';
      // } else {
      //   return fileList
      //     .map(item => item.url.replace(window.location.origin, ''))
      //     .join('');
      // }
      return fileList
        .map((item) => item.url.replace(window.location.origin, ''))
        .join(',');
    },
    handleRemove(file, fileList) {
      this.$emit('input', this.convertFile(fileList));
      if (this.onRemove) {
        this.onRemove(file, fileList);
      }
    },
    async upload(option) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      const ctx = canvas.getContext('2d');
      img.src = URL.createObjectURL(option.file);
      if (this.mkWidth > 0 && this.mkHeight > 0) {
        // eslint-disable-next-line no-undef
        await new Promise((resolve) => {
          img.onload = function() {
            canvas.width = this.mkWidth;
            canvas.height = this.mkHeight;
            // 这里的长宽是绘制到画布上的图片的长宽
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 0.95是最接近原图大小，如果质量为1的话会导致比原图大几倍。
            canvas.toBlob(
              function(blob) {
                resolve(blob);
              },
              'image/jpeg',
              0.95
            );
          };
        }).then((blob) => {
          option.file = blob;
        });
      }
      return ajax(option);
    },
    handleSuccess(response, file, fileList) {
      try {
        if (response.state === 'SUCCESS') {
          Object.assign(file, response, {
            url: `${window.location.origin}${response.url}`
          });
          this.$emit('input', this.convertFile(fileList));
          if (this.onSuccess) {
            this.onSuccess(response, file, fileList);
          }
        } else if (response.status) {
          if (this.onError) {
            this.onError(
              {
                status: response.status,
                message: response.message
              },
              file,
              fileList
            );
          }
        }
      } catch (e) {
        if (this.onError) {
          this.onError(e, file, fileList);
        }
      }
    },
    handleProgress(event, file, fileList) {
      this.$nextTick(() => {
        const circle = this.$refs.box.querySelector('.el-progress-circle');
        const circleBox = this.$refs.box.querySelector('.el-progress--circle');
        if (circle) {
          circle.style.width = `${this.mkWidthShow - 30}px`;
        }
        if (circleBox) {
          circleBox.style.width = `${this.mkWidthShow - 30}px`;
        }
      });
      if (this.onProgress) {
        this.onProgress(event, file, fileList);
      }
    },
    handleBeforeUpload(file) {
      console.log(file);
      if (this.mkFileTypes) {
        const isRT =
          this.mkFileTypes
            .split(',')
            .map((item) => {
              if (mime.getType(item) === 'audio/mpeg') {
                return 'mp3';
              }
              return mime.getType(item);
            })
            .indexOf(file.type) > -1;
        if (isRT === false) {
          this.$message.error(`只能上传类型为${this.mkFileTypes}的文件`);
          return false;
        }
      }
      if (this.mkMaxFileSize > 0) {
        const isLtM = file.size / 1024 / 1024 < this.mkMaxFileSize;
        if (isLtM === false) {
          this.$message.error(`上传文件大小不能超过${this.mkMaxFileSize}MB!`);
          return false;
        }
      }
      if (this.beforeUpload) {
        return this.beforeUpload(file);
      }
    },
    handleChange(file, fileList) {
      console.log(fileList);
      this.changeCard();
      if (this.onChange) {
        this.onChange(file, fileList);
      }
    },
    changeCard() {
      this.$nextTick(() => {
        const els = this.$refs.box.querySelectorAll(
          '.el-upload-list--picture-card .el-upload-list__item'
        );

        if (els && els.length > 0) {
          const imgbox = this.$refs.box;
          if (imgbox) {
            imgbox.style.height = `${this.mkHeightShow}px`;
          }
          els.forEach((element) => {
            element.style.width = `${this.mkWidthShow}px`;
            element.style.height = `${this.mkHeightShow}px`;
            element.style.visibility = 'visible';
          });
        }
        const actions = this.$refs.box.querySelector(
          '.el-upload-list--picture-card .el-upload-list__item-actions'
        );
        if (actions) {
          actions.style.fontSize = `${Math.max(this.mkWidthShow / 5, 10)}px`;
        }
      });
    }
  },
  mounted() {
    this.changeCard();
    if (this.listType === 'picture-card') {
      this.handlePreviewFun = this.handlePreview;
    }
    if (this.onPreview) {
      this.handlePreviewFun = this.onPreview;
    }
    this.$nextTick(() => {
      const el = this.$refs.box.querySelector('.el-upload--picture-card');
      if (el) {
        el.style.width = `${this.mkWidthShow}px`;
        el.style.height = `${this.mkHeightShow}px`;
        el.style.lineHeight = `${this.mkHeightShow - 2}px`;
      }

      const i = this.$refs.box.querySelector('.el-upload--picture-card i');
      if (i) {
        i.style.fontSize = `${Math.max(this.mkWidthShow / 5, 10)}px`;
      }
    });
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
</style>
