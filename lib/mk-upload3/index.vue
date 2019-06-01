<template>
  <div v-cloak class="box" v-loading="uping" :element-loading-text="`正在上传 ${nowUpload}`" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" ref="box">
    <!-- 文件列表 -->
    <ul :class="chooseBoxCls">
      <ul ref="list" v-if="showFileList" :class="chooseBoxCls">
        <li v-for="(file, index) in uploadFiles" :class="['el-upload-list__item', 'is-success', 'focusing']" :style="fileStyle" :key="file.url">
          <img class="el-upload-list__item-thumbnail" :ref="`file-${index}`" @load="$imgLoad($event, file)" :src="file.url" alt="" />
          <label class="el-upload-list__item-status-label-size" v-if="file.width">{{ file.width }}*{{ file.height }}</label>
          <label class="el-upload-list__item-status-label" v-if="file.checked === true">
            <i class="el-icon-upload-success el-icon-check" />
          </label>
          <span class="el-upload-list__item-actions" :style="actionStyle">
            <span class="el-upload-list__item-preview" v-if="uploadDisabled === false" @click="$handleRemove(file)">
              <i class="el-icon-delete" />
            </span>
            <span class="el-upload-list__item-preview" v-if="uploadDisabled === false" @click="$handleReplace(index)">
              <i class="el-icon-refresh" />
            </span>
            <span class="el-upload-list__item-preview" @click="$handleView(file, index)">
              <i class="el-icon-caret-right" />
            </span>
            <span class="el-upload-list__item-preview" @click="$handleDown(file)">
              <i class="el-icon-download" />
            </span>
          </span>
        </li>
      </ul>
      <!-- 文件上传或选择 -->
      <li
        @click="$addFile(true)"
        v-show="upShow && uploadDisabled !== true"
        v-if="choose === true"
        :upShow="upShow"
        :disabled="disabled"
        :uploadDisabled="uploadDisabled"
        :style="upStyle"
        style="border: 1px dashed #c0ccda;"
        class="el-upload-list__item is-success focusing menu"
        :class="upCardCls"
      >
        <slot>
          选择文件库
          <i class="el-icon-plus" :style="actionStyle" />
        </slot>
        <!-- <label class="el-upload-list__item-status-label-size"
               style="color:#00a3ef">选择文件库</label> -->
      </li>
      <!-- 文件自定义选择 -->
      <li
        @click="$addFile(true, false, true)"
        v-show="upShow && uploadDisabled !== true"
        v-if="chooseCustom"
        :upShow="upShow"
        :disabled="disabled"
        :uploadDisabled="uploadDisabled"
        :style="upStyle"
        :title="customChooseTitle"
        style="border: 1px dashed #c0ccda;"
        class="el-upload-list__item is-success focusing menu"
        :class="upCardCls"
      >
        <slot>
          <span style="font-size:11px;">{{ customChooseTitle }}</span>
          <i class="el-icon-search" :style="actionStyle" />
        </slot>
      </li>
      <!-- 文件强制上传 -->
      <li
        @click="$addFile(true, true)"
        v-show="upShow && uploadDisabled !== true"
        v-if="choose === false || chooseAndUpload === true"
        :upShow="upShow"
        :disabled="disabled"
        :uploadDisabled="uploadDisabled"
        :style="upStyle"
        style="border: 1px dashed #c0ccda;"
        class="el-upload-list__item is-success focusing menu"
        title="上传新文件"
        :class="upCardCls"
      >
        <slot>
          上传新文件
          <i class="el-icon-upload" :style="actionStyle" />
        </slot>
      </li>
    </ul>
    <!-- 文件预览 -->
    <el-dialog visible v-if="previewIng && uploadFiles[preivewIndex]" append-to-body :width="`${preivewWidth}px`" :show-close="false" @close="$previewEnd">
      <div slot="title">第{{ preivewIndex + 1 }}张图,点击图片可预览下一张</div>
      <img width="100%" :src="uploadFiles[preivewIndex].url" @click="$autoView" alt="" />
      <div slot="footer" :element-loading-text="`正在上传 ${nowUpload}`" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading="uping">
        <mk-button @click="$lastPreview" :disabled="preivewIndex <= 0">上一张</mk-button>
        <mk-button @click="$nextPreview" :disabled="preivewIndex >= uploadFiles.length - 1">下一张</mk-button>
        <mk-button @click="$handleDown(uploadFiles[preivewIndex])">下载</mk-button>
        <mk-button @click="$handleReplace(preivewIndex)">替换</mk-button>
        <mk-button @click="$handleRemove(uploadFiles[preivewIndex], true)">删除</mk-button>
      </div>
    </el-dialog>
    <!-- 文件选择 -->
    <el-dialog :visible="chooseIng" v-if="choose" append-to-body top="4vh" width="980px" @close="$chooseEnd">
      <div slot="title">
        选择文件
        <el-tag type="warning" v-if="this.limit > 0 && this.uploadFiles.length < this.limit">还能选择{{ uploadFiles.length | mathSub(limit) | mathAbs }}张</el-tag>
        <el-tag type="success" v-else-if="limit > 0">已经全部选择完毕，不能再选择了</el-tag>
      </div>
      <div v-loading="chooseLoading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-row>
          <el-col :span="4">
            <el-row
              v-loading="chooseNewFolderIng"
              style="display: flex;align-items: baseline;"
              element-loading-text="保存中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-col :span="24" class="el-folder">
                <el-popover placement="bottom" width="200" v-model="chooseNewFolderVisible" trigger="click">
                  <el-input class="input-new-tag" v-model="chooseNewFolder" ref="chooseFolderInput" size="small" />
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" :loading="chooseNewFolderIng" @click="$chooseNewFolder(false)">取消</el-button>
                    <el-button type="primary" size="mini" :loading="chooseNewFolderIng" @click="$chooseNewFolder">确定</el-button>
                  </div>
                  <mk-button :type="4" class="button-new-tag" slot="reference" icon="el-icon-plus" @click="$chooseNewFolderVisible">新文件夹</mk-button>
                  <mk-button :type="4" class="button-new-tag" slot="reference" icon="el-icon-refresh" v-show="lockFolder" @click="$clearLock">显示全部文件夹</mk-button>
                </el-popover>
                <ul class="choose-tag">
                  <li
                    v-for="(item, index) in chooseFolders"
                    v-show="!lockFolder || item.lock"
                    @click.self="$lockFolder(item)"
                    :type="item.cfid === (chooseFolder && chooseFolder.cfid) ? 'danger' : 'info'"
                    :key="index"
                  >
                    {{ item.cfname }}
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row
              v-loading="chooseNewFolderIng"
              style="display: flex;align-items: baseline;"
              element-loading-text="保存中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-col :span="4">
                <mk-upload2
                  style="display:inline"
                  :value-model="false"
                  :choose="false"
                  multiple
                  :save-res="false"
                  @success="$chooseUpSuc"
                  :compress="compress"
                  :compress-height="compressHeight"
                  :compress-width="compressWidth"
                  :size="size"
                >
                  <mk-button :type="4" icon="el-icon-plus">上传新文件</mk-button>
                </mk-upload2>
              </el-col>
            </el-row>
            <ul :class="chooseBoxCls" v-loading="chooseDelIng" v-if="chooseFiles.length > 0">
              <li v-for="(file, index) in chooseFiles" :class="['el-upload-list__item', 'is-success', 'focusing']" :key="index">
                <img class="el-upload-list__item-thumbnail" :ref="file.rsid" @load="$imgLoad($event, file)" :src="file.url" alt="" />
                <label class="el-upload-list__item-status-label-size" v-if="file.width">{{ file.width }}*{{ file.height }}</label>
                <label class="el-upload-list__item-status-label" v-if="file.checked === true">
                  <i class="el-icon-upload-success el-icon-check" />
                </label>
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="$choose(file)">
                    <i class="el-icon-check" v-if="file.checked === false" />
                    <i class="el-icon-minus" v-else />
                  </span>
                  <span class="el-upload-list__item-preview" @click="$chooseDel(file)">
                    <i class="el-icon-delete" />
                  </span>
                  <span class="el-upload-list__item-preview" @click="$handleDown(file)">
                    <i class="el-icon-download" />
                  </span>
                </span>
              </li>
            </ul>
            <el-alert v-else center title="暂无文件" description="请查看其它文件夹或者上传新文件" :closable="false" type="warning" show-icon />
            <el-pagination
              :page-sizes="[42, 84]"
              :page-size="choosePageSize"
              :current-page="choosePage"
              @size-change="$chooseSizeChange"
              @current-change="$choosePageChange"
              layout="total, sizes, prev, pager, next, jumper"
              :total="chooseRows"
            />
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 文件选择2 -->
    <el-dialog :visible="chooseIng2" v-if="chooseCustom" append-to-body top="4vh" width="980px" @close="$chooseEnd">
      <div slot="title">
        {{ customChooseTitle }}
        <el-tag type="warning" v-if="this.limit > 0 && this.uploadFiles.length < this.limit">还能选择{{ uploadFiles.length | mathSub(limit) | mathAbs }}张</el-tag>
        <el-tag type="success" v-else-if="limit > 0">已经全部选择完毕，不能再选择了</el-tag>
      </div>
      <ul :class="chooseBoxCls" v-loading="chooseDelIng" v-if="customFiles.length > 0">
        <li v-for="(file, index) in customFiles" :class="['el-upload-list__item', 'is-success', 'focusing']" :key="index">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <label class="el-upload-list__item-status-label-size" v-if="file.width">{{ file.width }}*{{ file.height }}</label>
          <label class="el-upload-list__item-status-label" v-if="uploadFiles.findIndex((fl) => fl.url === file.url) > -1">
            <i class="el-icon-upload-success el-icon-check" />
          </label>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="$choose(file)">
              <i class="el-icon-check" v-if="uploadFiles.findIndex((fl) => fl.url === file.url) === -1" />
              <i class="el-icon-minus" v-else />
            </span>
            <span class="el-upload-list__item-preview" @click="$handleDown(file)">
              <i class="el-icon-download" />
            </span>
          </span>
        </li>
      </ul>
      <el-alert v-else center title="暂无文件" :closable="false" type="warning" show-icon />
    </el-dialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs';
const status = 'success';

/**
 * electron 上传图片专用
 * emit
 * success(key)
 * remove(key)
 *
 * slot
 * default 触发上传的按钮,如果没有这个slot那么默认展示一个+，点击+上传
 *
 * v-model="[key1, key2]" 或者v-model="key"
 * 当multiple=true时，绑定的是数组，否则绑定的字符串
 * value-model=false时，仅通知success事件，而不进行双向绑定，也不记录已经上传成功的文件
 *
 */

export default {
  name: 'MkUpload3',
  props: {
    value: {
      type: [String, Array]
    },
    valueModel: {
      type: Boolean,
      default: true
    },
    // 批量上传?
    // false时，强制将limit改为1
    multiple: {
      type: Boolean,
      default: false
    },
    // 显示文件列表?
    showList: {
      type: Boolean,
      default: true
    },
    // 提示文字
    tip: String,
    // 禁用?
    disabled: {
      type: Boolean,
      default: false
    },
    // 最多多少个文件,0=无限
    limit: {
      type: Number,
      default: 0
    },
    // 文件大小,单位是M,默认5M
    size: {
      type: Number,
      default: 0
    },
    // 图片文件希望的压缩宽度,单位px
    // 0 表示不压缩
    // 这是上传组件的压缩，与剪切功能无关
    compressWidth: {
      type: Number,
      default: 0
    },
    // 图片文件希望的压缩高度,单位px
    // 0 表示不压缩
    // 这是上传组件的压缩，与剪切功能无关
    compressHeight: {
      type: Number,
      default: 0
    },
    // 图片上传质量,默认0，可取0-100
    // 0- 不压缩
    // 这是上传组件的压缩，与剪切功能无关
    compress: {
      type: Number,
      default: 0
    },
    // picture-card时文件列表的宽度
    width: {
      type: Number,
      default: 100
    },
    // picture-card时文件列表高度
    height: {
      type: Number,
      default: 100
    },
    // 选择文件?
    choose: {
      type: Boolean,
      default: true
    },
    // 选择的同时也能直接上传
    chooseAndUpload: {
      type: Boolean,
      default: false
    },
    // 自定义选择,必须传递customList
    chooseCustom: {
      type: Boolean,
      default: false
    },
    // 自定义选择title
    customChooseTitle: {
      type: String,
      default: '选择本页面图片'
    },
    // 自定义文件
    customList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否保存上传信息到资源表?
    saveRes: {
      type: Boolean,
      default: true
    },
    // 上传文件自定义保存方法
    saveResFn: Function
  },
  data() {
    return {
      notDrag: true,
      // 挂载的文件列表
      uploadFiles: [],
      // 文件计数变量
      tempIndex: 1,
      // 上传中
      uping: false,
      // 选择文件弹框
      chooseIng: false,
      chooseIng2: false,
      // 单个文件聚焦状态
      focusing: false,
      // 带选择文件列表
      chooseFiles: [],
      // 选择文件加载中
      chooseLoading: false,
      // 选择文件当前第几页
      choosePage: 1,
      // 选择文件每页条数
      choosePageSize: 42,
      // 当前选中的文件夹
      chooseFolder: {},
      // 文件夹列表
      chooseFolders: [],
      // 选择文件的记录数
      chooseRows: 0,
      // 正在新增新文件夹的状态
      chooseNewFolderVisible: false,
      // 新录入的文件夹名称
      chooseNewFolder: null,
      // 新增保存中
      chooseNewFolderIng: false,
      // 选择文件删除中
      chooseDelIng: false,
      // 替换的文件的下标
      replaceIndex: -1,
      // 有锁定的文件夹
      lockFolder: false,
      // 文件预览框打开与否
      previewIng: false,
      preivewWidth: 0,
      preivewIndex: -1,
      // 上传进度
      nowUpload: '1/1'
    };
  },
  computed: {
    // 自己禁用或者所属表单禁用
    uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    // 只有自己设置为展示文件列表、同时是valueModel时
    // 才展示文件列表
    showFileList() {
      return this.valueModel === true && this.showList === true;
    },
    // 只有multiple时才支持多个文件
    limitFile() {
      return this.multiple === true ? this.limit : 1;
    },
    // 文件列表宽高
    fileStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      };
    },
    // 文件列表操作按钮字体大小
    actionStyle() {
      return {
        fontSize: `${Math.max(Math.min(this.height / 5, this.width / 5), 10)}px`
      };
    },
    // 上传按钮样式
    upStyle() {
      return {
        width: !this.$slots.default ? `${this.width}px` : '',
        height: !this.$slots.default ? `${this.height}px` : '',
        lineHeight: !this.$slots.default ? `${this.height - 2}px` : ''
      };
    },
    // 上传按钮的cls
    upCardCls() {
      return {
        'el-upload--picture-card': !this.$slots.default,
        'el-upload': !this.$slots.default,
        'el-upload--noheight': !!this.$slots.default
      };
    },
    // 上传按钮是否显示
    upShow() {
      return isNaN(this.limitFile) || this.limitFile === 0 || this.limitFile > this.uploadFiles.length;
    },
    // 文件选择列表的样式
    chooseBoxCls() {
      return {
        'el-upload-list': true,
        'el-upload-list--picture-card': true,
        'el-choose-file': true,
        'el-choose-file-img': true
      };
    },
    customFiles() {
      if (this.customList) {
        return this.customList.map((file) => {
          const item = {};
          item.key = this.$genViewKey(file);
          item.checked = this.uploadFiles.findIndex((fl) => fl.key === item.key) > -1;
          item.url = file;
          item.width = 0;
          item.height = 0;
          return item;
        });
      } else {
        return [];
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(vl) {
        // 非valueModel时，跳过操作
        if (this.valueModel === false) return;
        if (vl) {
          // 非多选时，文件是一个字符串，这里强制转为数组
          if (this.multiple === false) vl = [vl];
          const oldFiles = this.uploadFiles.filter((item) => item.status !== 'success');
          this.uploadFiles = [];
          vl.forEach((url) => {
            if (url) {
              const key = this.$genViewKey(url);
              let cache = this.$cache.get(key);
              if (cache) {
                cache = JSON.parse(cache);
              } else {
                cache = {
                  width: 0,
                  height: 0
                };
              }
              this.$push({
                status,
                key,
                url,
                ...cache
              });
            }
          });
          oldFiles.forEach((item) => {
            this.$push(item);
          });
        }
      }
    }
  },
  methods: {
    // 解析key
    $genViewKey(uri) {
      const arr = uri.match(/key=([0-9a-zA-Z.]+)/);
      if (arr && arr.length === 2) {
        return arr[1];
      }
      return uri;
    },
    // 上传
    async $upload() {
      const size = {};
      if (this.compressWidth) {
        size.width = this.compressWidth;
      }
      if (this.compressHeight) {
        size.height = this.compressHeight;
      }
      this.uping = true;
      try {
        this.nowUpload = '1/1';
        const uris = await this.$ipc.each(
          'choose-upload-file',
          (steps) => {
            this.nowUpload = steps;
          },
          {
            title: '请选择要上传的文件(仅支持jpg、png)',
            type: ['jpg', 'png'],
            multi: this.multiple,
            name: 'jpeg图片',
            size,
            limit: this.limit,
            quality: this.compress
          }
        );
        uris.forEach((url, index) => {
          const key = this.$genViewKey(url);
          if (this.limit === 0 || (this.limit > 0 && this.uploadFiles.length < this.limit)) {
            if (
              this.$push({
                key,
                status,
                url,
                width: 0,
                height: 0
              }) === true
            ) {
              this.$chooseUpSuc(url, key);
            } else {
              this.$message.warning(`第${index + 1}个文件已经存在!`);
            }
          } else {
            this.$message.warning(`最多上传${this.limit}个文件!`);
          }
        });
        this.$input();
      } finally {
        this.uping = false;
      }
    },
    // 打开用户本地添加文件对话框
    // add= 是否是新增，否则是替换
    // forceAdd= 强制上传，而不是有可能性的选择
    // 自定义选择?
    async $addFile(add, forceAdd, customChoose) {
      if (add === true) {
        this.replaceIndex = -1;
      }
      if (!this.disabled) {
        if (forceAdd === true) {
          this.$upload();
        } else {
          if (customChoose === true) {
            await this.$startChoose2();
          } else if (this.choose === true) {
            await this.$startChoose();
          } else {
            this.$upload();
          }
        }
      }
    },
    // 处理移除文件
    $handleRemove(raw, isView) {
      const fileIndex = this.uploadFiles.findIndex((item) => item.key === raw.key);
      if (fileIndex + 1 > this.uploadFiles.length) {
        this.preivewIndex = this.preivewIndex + 1;
      } else {
        this.preivewIndex = 0;
      }
      const file = this.uploadFiles.find((item) => item.key === raw.key);
      this.uploadFiles.splice(fileIndex, 1);
      if (file.status === 'success') {
        this.$input();
        this.$emit('remove', file.url);
      }
    },
    // 结束预览
    $previewEnd() {
      this.previewIng = false;
      this.preivewIndex = -1;
    },
    // 文件下载
    async $handleDown(file) {
      const result = await this.$ipc.each('save-file', {
        filepath: file.url,
        title: '请选择文件存储路径',
        type: ['jpg'],
        name: 'jpeg图片'
      });
      if (result) {
        this.$message('下载完毕');
      }
    },
    // 文件预览
    $handleView(file, index) {
      const img = index !== undefined ? this.$refs[`file-${index}`] : this.$refs[file.rsid];
      if (img && img[0]) {
        this.preivewWidth = img[0].naturalWidth;
      } else {
        this.preivewWidth = 1024;
      }
      this.previewIng = true;
      this.preivewIndex = index;
    },
    $autoView() {
      if (this.preivewIndex < this.uploadFiles.length - 1) {
        this.$nextPreview();
      } else {
        this.$handleView(this.uploadFiles[0], 0);
      }
    },
    $lastPreview() {
      this.$handleView(this.uploadFiles[this.preivewIndex - 1], this.preivewIndex - 1);
    },
    $nextPreview() {
      this.$handleView(this.uploadFiles[this.preivewIndex + 1], this.preivewIndex + 1);
    },
    // 广播v-model改变
    $input() {
      if (this.valueModel === true) {
        const result = [];
        const size = [];
        this.uploadFiles.forEach((item) => {
          if (item.status === 'success') {
            result.push(item.url);
            if (item.width) {
              size.push({
                width: item.width,
                height: item.height
              });
            } else {
              let cache = this.$cache.get(item.key);
              if (cache) {
                size.push(JSON.parse(cache));
              }
            }
          }
        });
        if (this.multiple === true) {
          this.$emit('input', result);
        } else if (result.length > 0) {
          this.$emit('input', result[0]);
        } else {
          this.$emit('input', null);
        }
        this.$emit('change', size);
      }
    },
    // 替换图片
    $handleReplace(index) {
      this.replaceIndex = index;
      this.$addFile();
    },
    // 启动选择界面
    async $startChoose() {
      this.chooseIng = true;
      this.choosePage = 1;
      await this.$initChooseFolders();
      await this.$chooseLoading();
    },
    // 启动选择界面
    async $startChoose2() {
      this.chooseIng2 = true;
    },
    // 关闭选择界面
    $chooseEnd() {
      this.chooseIng = false;
      this.chooseIng2 = false;
      this.previewIng = false;
    },
    // 选择文件界面 文件列表加载
    async $chooseLoading() {
      try {
        this.chooseLoading = true;
        if (this.chooseFolders.length === 0) {
          return;
        }
        if (!this.chooseFolder) {
          return;
        }
        const response = await this.$get('/query.json', {
          sqlCode: 'cmResource.select_list',
          currentPage: this.choosePage,
          pageSize: this.choosePageSize,
          rstype: this.type,
          cfid: this.chooseFolder.cfid
        });
        this.chooseRows = response.totalRow;
        response.list.forEach((item) => {
          item.key = this.$genViewKey(item.rsuri);
          item.checked = this.uploadFiles.findIndex((fl) => fl.key === item.key) > -1;
          item.url = item.rsuri;
          item.width = 0;
          item.height = 0;
        });
        this.chooseFiles = response.list;
      } catch (e) {
        this.$message.error('加载失败');
      } finally {
        this.chooseLoading = false;
      }
    },
    // 选择文件夹初始化 文件夹
    async $initChooseFolders() {
      if (this.choose === true) {
        const rstype = this.type;
        const response = await this.$get('query.json', {
          sqlCode: 'cmResourceFolder.select_list',
          rstype,
          sortName: 'cfname',
          sortType: 'asc'
        });
        const fileFloders = response.list;
        const lockid = this.$cache.get(`${this.type}-lock-folder`);
        if (lockid) {
          this.lockFolder = true;
        }
        for (let item of fileFloders) {
          if (item.cfid === lockid) {
            item.lock = true;
            this.chooseFolder = item;
            await this.$chooseLoading();
          } else {
            item.lock = false;
          }
        }
        if (fileFloders.length > 0 && !this.chooseFolder) {
          this.chooseFolder = fileFloders[0];
        }
        this.chooseFolders = fileFloders;
      }
    },
    // 解除锁定
    async $clearLock() {
      this.chooseFolders.forEach((item) => {
        item.lock = false;
      });
      this.lockFolder = false;
      this.$cache.remove(`${this.type}-lock-folder`);
      this.chooseFolder = {};
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 锁定与解锁
    async $lockFolder(folder) {
      folder.lock = !folder.lock;
      if (folder.lock === true) {
        this.lockFolder = true;
        this.$cache.set(`${this.type}-lock-folder`, folder.cfid);
        this.chooseFolder = folder;
      } else {
        this.lockFolder = false;
        this.$cache.remove(`${this.type}-lock-folder`);
        this.chooseFolder = {};
      }
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 选择文件页面尺寸改变
    async $chooseSizeChange(vl) {
      this.choosePageSize = vl;
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 选择文件页码改变
    async $choosePageChange(vl) {
      this.choosePage = vl;
      await this.$chooseLoading();
    },
    // 选择文件界面文件上传后需处理
    // 将文件key提交数据库
    async $chooseUpSuc(rsuri, rsname) {
      if (this.saveRes === true) {
        await this.$post('/cmResource/add.json', {
          cmResource: {
            rsname,
            rstype: this.type,
            rsuri,
            isactive: 1,
            paymoney: 0,
            cfid: this.chooseFolder && this.chooseFolder.cfid
          }
        });
      }
      if (this.saveResFn) {
        await this.saveResFn({
          rsuri,
          rsname
        });
      }
      if (this.choose === true) {
        this.choosePage = 1;
        await this.$chooseLoading();
      }
    },
    $push(file) {
      const oldFile = this.uploadFiles.find((item) => item.key === file.key);
      if (!oldFile) {
        file.count = 1;
        this.uploadFiles.push(file);
        return true;
      } else {
        return false;
      }
    },
    // 选择文件界面选中处理
    $choose(file) {
      const index = this.uploadFiles.findIndex((fl) => fl.key === file.key);
      if (index === -1) {
        if (this.limit > 0 && this.uploadFiles.length === this.limit) {
          const lastChecked = this.chooseFiles.find((item) => item.key === this.uploadFiles[0].key);
          lastChecked && (lastChecked.checked = false);
          this.uploadFiles.splice(0, 1);
        }
        if (this.replaceIndex > -1) {
          this.uploadFiles[this.replaceIndex] = {
            key: file.key,
            name: file.rsname,
            status: 'success',
            url: file.url,
            width: file.width,
            height: file.height
          };
        } else if (this.limit === 0 || (this.limit > 0 && this.uploadFiles.length < this.limit)) {
          this.$push({
            key: file.key,
            name: file.rsname,
            status: 'success',
            url: file.url,
            width: file.width,
            height: file.height
          });
        } else {
          return;
        }

        file.checked = true;
        this.$input();
        this.$emit('success', file.rsuri, file.rsname);
        if (this.limit === 1) {
          this.chooseIng = false;
        }
      } else {
        file.checked = false;
        this.uploadFiles.splice(index, 1);
        this.$input();
        this.$emit('remove', file.rsuri);
      }
    },
    // 选择文件中新增文件夹保存
    async $chooseNewFolder(cancel) {
      if (cancel !== false) {
        let inputValue = this.chooseNewFolder;
        if (inputValue) {
          if (inputValue.length > 16) {
            this.$message.error('长度不能超过16个字');
            return;
          }
          this.chooseNewFolderIng = true;
          try {
            const id = await this.$post('/cmResourceFolder/add.json', {
              cfname: inputValue,
              rstype: this.type
            });
            this.$cache.set(`${this.type}-lock-folder`, id.result);
            await this.$initChooseFolders();
          } catch (e) {
            this.$message.error('保存发生错误：');
            return;
          } finally {
            this.chooseNewFolderIng = false;
          }
        }
      }
      this.chooseNewFolderVisible = false;
      this.chooseNewFolder = '';
    },
    // 开始新建文件夹
    $chooseNewFolderVisible() {
      this.chooseNewFolderVisible = true;
      this.$nextTick(() => {
        this.$refs.chooseFolderInput.$refs.input.focus();
      });
    },
    // 删除
    async $chooseDel(file) {
      this.chooseDelIng = true;
      let data = await this.$delete('cmResource/deleteByid.json', {
        rsid: file.rsid
      });
      if (data) {
        await this.$chooseLoading();
      }
      this.chooseDelIng = false;
    },
    $imgLoad(event, file) {
      file.width = event.target.naturalWidth;
      file.height = event.target.naturalHeight;
      this.$cache.set(file.key, {
        width: file.width,
        height: file.height
      });
    },
    // 对外开放的：上传开始
    submit() {
      this.uploaderHandel.start();
    },
    // 对外开放的：获取文件的宽高
    getSize() {
      const result = [];
      this.uploadFiles.forEach((file, index) => {
        const img = this.$refs[`file-${index}`];
        if (img && img[0]) {
          result.push({
            width: img[0].naturalWidth,
            height: img[0].naturalHeight
          });
        }
      });
      return result;
    },
    // 对外开放的：新增文件
    addFile() {
      this.$addFile(true);
    }
  },
  async mounted() {
    if (this.$refs.list) {
      const that = this;
      this.sortAble = new Sortable(this.$refs.list, {
        filter: '.menu',
        onStart() {
          that.notDrag = false;
        },
        onEnd({ oldIndex, newIndex }) {
          that.uploadFiles.splice(newIndex, 0, ...that.uploadFiles.splice(oldIndex, 1));
          that.$input();
          // that.notDrag = true;
        }
      });
    }
  },
  provide() {
    return {
      uploader: this
    };
  },
  inject: {
    elForm: {
      default: ''
    }
  },
  beforeDestroy() {
    if (this.sortAble) {
      this.sortAble.destroy();
    }
  }
};
</script>
<style scoped>
.box {
  display: block !important;
}
.el-upload--picture-card {
  width: unset;
  height: unset;
  line-break: unset;
}
[v-cloak] {
  display: none;
}
.el-choose-file {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  align-items: flex-end;
}
.el-choose-file >>> .el-upload-list__item-actions {
  font-size: 15px;
}
.el-choose-file >>> .el-upload-list__item-actions span + span {
  margin-left: 5px;
}
.el-choose-file-img li {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(192, 196, 204, 0.3);
  cursor: pointer;
}
.el-choose-file-img li img {
  height: unset;
}
.el-upload--noheight {
  width: auto !important;
  height: auto !important;
  background-color: unset !important;
  border: unset !important;
  margin: 0 !important;
}
.el-choose-file-text li {
  width: 245px;
  padding: 0 5px;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(192, 196, 204, 0.3);
  cursor: pointer;
}
.el-choose-file-text li img {
  height: unset;
}
.el-choose-file-text li span {
  overflow: hidden;
  width: 140px;
}
.el-choose-file-text li .el-upload-list__item-actions {
  width: auto;
}
.el-folder {
  display: flex;
  flex-wrap: wrap;
}
.choose-tag {
  cursor: pointer;
  width: 100%;
  padding: 0 5px;
}
.choose-tag li {
  float: left;
  width: 100%;
  color: #666;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  margin: 1px 0;
  list-style: none;
}
.choose-tag li:hover {
  color: #00a3ef;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 5px;
}
.el-tag--danger {
  background-color: rgba(245, 108, 108, 0.1);
}
.el-pagination {
  text-align: center;
}
.el-alert {
  height: 300px;
}
</style>
<style>
.el-upload-list__item-status-label-size {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 24px;
  background: #fdfdfda2;
  text-align: center;
  border-radius: 6px 0 0 0;
}
</style>
