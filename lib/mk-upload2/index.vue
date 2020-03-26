<template>
  <div v-cloak
       class="box"
       v-loading="uping"
       :element-loading-text="`上传进度：${percentage}%`"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       ref="box">
    <!-- 文件列表 -->
    <ul :class="chooseBoxCls">
      <ul ref="list"
          v-if="showFileList && uploadFiles.length > 0"
          :class="chooseBoxCls">
        <li v-for="(file, index) in uploadFiles"
            :class="['el-upload-list__item', 'is-success','focusing']"
            :style="fileStyle"
            :key="index">
          <img class="el-upload-list__item-thumbnail"
               :ref="`file-${index}`"
               @load="$imgLoad($event, file)"
               v-if="listType === 'card'"
               :src="type === 'IMAGE' ? file.url : accept[type].uri"
               alt="">
          <span v-else>{{file.rsname || '文件'}}</span>
          <label class="el-upload-list__item-status-label"
                 v-if="file.checked === true">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <el-progress v-if="file.status === 'uploading'"
                       :type="listType === 'card' ? 'circle' : 'line'"
                       :stroke-width="listType === 'card' ? 6 : 2"
                       :percentage="parseInt(file.percentage, 10)">
          </el-progress>
          <span class="el-upload-list__item-actions"
                :style="actionStyle">
            <span class="el-upload-list__item-preview"
                  @click="$handleView(file, index)">
              <i class="el-icon-caret-right"></i>
            </span>
            <span class="el-upload-list__item-preview"
                  v-if="uploadDisabled === false"
                  @click="$handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
            <span class="el-upload-list__item-preview"
                  v-if="uploadDisabled === false"
                  @click="$handleReplace(index)">
              <i class="el-icon-refresh"></i>
            </span>
            <br v-if="move" />
            <span v-if="move"
                  class="el-upload-list__item-preview"
                  @click="$$left(index)">
              <i class="el-icon-d-arrow-left"></i>
            </span>
            <span v-if="move"
                  class="el-upload-list__item-preview"
                  @click="$left(index)">
              <i class="el-icon-arrow-left"></i>
            </span>
            <span v-if="move"
                  class="el-upload-list__item-preview"
                  @click="$right(index)">
              <i class="el-icon-arrow-right"></i>
            </span>
            <span v-if="move"
                  class="el-upload-list__item-preview"
                  @click="$$right(index)">
              <i class="el-icon-d-arrow-right"></i>
            </span>
          </span>
        </li>
      </ul>

      <!-- 文件上传或选择 -->
      <li @click="$addFile(true)"
          v-show="upShow && uploadDisabled !== true"
          :upShow="upShow"
          :disabled="disabled"
          :uploadDisabled="uploadDisabled"
          :style="upStyle"
          v-if="choose === true"
          style="border: 1px dashed #c0ccda;"
          class="el-upload-list__item is-success focusing"
          title="在文件库中选择"
          :class="upCardCls">
        <el-tooltip effect="dark"
                    v-if="fileTip"
                    :content="fileTip"
                    placement="bottom">
          <slot>
            <i class="el-icon-plus"
               :style="actionStyle" />
          </slot>
        </el-tooltip>
        <slot v-else>
          <i class="el-icon-plus"
             :style="actionStyle" />
        </slot>
      </li>
      <!-- 文件强制上传 -->
      <li @click="$addFile(true, true)"
          v-show="upShow && uploadDisabled !== true"
          v-if="choose === false || chooseAndUpload === true"
          :upShow="upShow"
          :disabled="disabled"
          :uploadDisabled="uploadDisabled"
          :style="upStyle"
          style="border: 1px dashed #c0ccda;"
          class="el-upload-list__item is-success focusing"
          title="上传新文件"
          :class="upCardCls">
        <el-tooltip effect="dark"
                    v-if="fileTip"
                    :content="fileTip"
                    placement="bottom">
          <slot>
            <i class="el-icon-upload"
               :style="actionStyle" />
          </slot>
        </el-tooltip>
        <slot v-else>
          <i class="el-icon-upload"
             :style="actionStyle" />
        </slot>
      </li>
      <!-- 文件自定义选择 -->
      <li @click="$addFile(true, false, true)"
          v-show="upShow && uploadDisabled !== true"
          v-if="chooseCustom"
          :upShow="upShow"
          :disabled="disabled"
          :uploadDisabled="uploadDisabled"
          :style="upStyle"
          :title="customChooseTitle"
          style="border: 1px dashed #c0ccda;"
          class="el-upload-list__item is-success focusing"
          :class="upCardCls">
        <el-tooltip effect="dark"
                    v-if="fileTip"
                    :content="fileTip"
                    placement="bottom">
          <slot>
            <i class="el-icon-search"
               :style="actionStyle" />
          </slot>
        </el-tooltip>
        <slot v-else>
          <i class="el-icon-search"
             :style="actionStyle" />
        </slot>
      </li>
    </ul>

    <!-- 文件预览 -->
    <mk-dialog visible
               mk-no-header
               v-if="(type === 'IMAGE' || type === 'GOMEZ' || type === 'VIDEO') && previewIng"
               append-to-body
               :width="`${preivewWidth}px`"
               :show-close="false"
               class="no-header"
               style="background-color:rgba(0,0,0,.5)"
               @close="$previewEnd">
      <img width="100%"
           v-if="type === 'IMAGE'"
           :src="preivewSrc"
           alt="">
      <img width="100%"
           v-if="type === 'GOMEZ'"
           :src="preivewSrc"
           alt="">
      <video tabindex="-1"
             v-if="type === 'VIDEO'"
             width="100%"
             preload="auto"
             controls
             :src="preivewSrc"></video>
      <div slot="footer">
        <mk-button :type="4"
                   @click="$lastPreview"
                   :disabled="preivewIndex > 0">上一张</mk-button>
        <mk-button :type="4"
                   @click="$nextPreview"
                   :disabled="preivewIndex < uploadFiles.length - 1">下一张</mk-button>
      </div>
    </mk-dialog>
    <!-- 音乐预览 -->
    <audio preload="auto"
           ref="audio"
           autoplay
           :src="preivewSrc"
           v-if="previewIng && type === 'VOICE'"></audio>
    <!-- 图片编辑 -->
    <el-dialog visible
               v-if="cut && cutIng && choose === false"
               append-to-body
               :show-close="false"
               title="剪切"
               top="5vh"
               :close-on-click-modal="false"
               :width="`${Math.min(cutWidth + 100,600)}px`"
               @close="cutIng = false">
      <div :style="{height: `${cutHeight+50}px`}">
        <vue-cropper ref="cropper"
                     :img="cutImage"
                     can-move
                     can-move-box
                     can-scale
                     auto-crop
                     info
                     output-type="png"
                     :auto-crop-width="cutWidth"
                     :auto-crop-height="cutHeight"
                     :fixed="cutFix[0] > 0"
                     :fixed-box="cutResize === false"
                     :fixed-number="cutFix"></vue-cropper>
      </div>
      <span slot="footer">
        <el-button type="primary"
                   icon="el-icon-arrow-right"
                   @click="$cutRotateRight">右转</el-button>
        <el-button type="primary"
                   icon="el-icon-arrow-left"
                   @click="$cutRotateLeft">左转</el-button>
        <el-button type="primary"
                   icon="el-icon-check"
                   @click="$cut(true)">确定</el-button>
        <el-button @click="$cut(false)"
                   icon="el-icon-close">原图上传</el-button>
      </span>
    </el-dialog>
    <!-- 文件选择 -->
    <el-dialog title="选择文件"
               :visible="chooseIng"
               v-if="choose"
               append-to-body
               top="4vh"
               width="980px"
               @close="$chooseEnd">
      <div v-loading="chooseLoading"
           element-loading-text="加载中..."
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-row>
          <el-col :span="4">
            <el-row v-loading="chooseNewFolderIng"
                    style="display: flex;align-items: baseline;"
                    element-loading-text="保存中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
              <el-col :span="24"
                      class="el-folder">
                <el-popover placement="bottom"
                            width="200"
                            v-model="chooseNewFolderVisible"
                            trigger="click">
                  <el-input class="input-new-tag"
                            v-model="chooseNewFolder"
                            ref="chooseFolderInput"
                            size="small">
                  </el-input>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini"
                               type="text"
                               :loading="chooseNewFolderIng"
                               @click="$chooseNewFolder(false)">取消</el-button>
                    <el-button type="primary"
                               size="mini"
                               :loading="chooseNewFolderIng"
                               @click="$chooseNewFolder">确定</el-button>
                  </div>
                  <mk-button :type="4"
                             class="button-new-tag"
                             slot="reference"
                             icon="el-icon-plus"
                             @click="$chooseNewFolderVisible">新文件夹</mk-button>
                  <mk-button :type="4"
                             class="button-new-tag"
                             slot="reference"
                             icon="el-icon-refresh"
                             v-show="lockFolder"
                             @click="$clearLock">显示全部文件夹</mk-button>
                </el-popover>
                <ul class="choose-tag">
                  <li v-for="(item, index) in chooseFolders"
                      v-show="!lockFolder || item.lock"
                      @click.self="$lockFolder(item)"
                      :type="item.cfid === (chooseFolder && chooseFolder.cfid) ? 'danger' : 'info'"
                      :key="index">
                    {{item.cfname}}</li>
                </ul>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row v-loading="chooseNewFolderIng"
                    style="display: flex;align-items: baseline;"
                    element-loading-text="保存中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
              <el-col :span="24">
                <mk-upload2 :type="type"
                            style="display:inline"
                            :token="token"
                            :value-model="false"
                            :choose="false"
                            list-type="text"
                            :cut-fix="cutFix"
                            :cut-resize="cutResize"
                            :cut-height="cutHeight"
                            :cut-width="cutWidth"
                            multiple
                            :cut="cut"
                            :preview="false"
                            :save-res="false"
                            @success="$chooseUpSuc"
                            :compress="compress"
                            :compress-height="compressHeight"
                            :compress-width="compressWidth"
                            :size="size">
                  <mk-button :type="4"
                             icon="el-icon-plus">上传新文件</mk-button>
                </mk-upload2>
              </el-col>
            </el-row>

            <ul :class="chooseBoxCls"
                v-loading="chooseDelIng"
                v-if="chooseFiles.length > 0">
              <li v-for="(file, index) in chooseFiles"
                  :class="['el-upload-list__item', 'is-success','focusing']"
                  :key="index">
                <img class="el-upload-list__item-thumbnail"
                     :ref="file.rsid"
                     @load="$imgLoad($event,file)"
                     v-if="listType === 'card'"
                     :src="type === 'IMAGE' ? file.url : accept[type].uri"
                     alt="">
                <span v-else>{{file.rsname}}</span>
                <label class="el-upload-list__item-status-label"
                       v-if="file.checked === true">
                  <i class="el-icon-upload-success el-icon-check"></i>
                </label>
                <span class="el-upload-list__item-actions">
                  <!-- <span class="el-upload-list__item-preview"
                        v-else
                        @click="$handleView(file)">
                    <i class="el-icon-caret-right"></i>
                  </span> -->
                  <span class="el-upload-list__item-preview"
                        v-if="editFile"
                        @click="$chooseEdit(file)">
                    <i class="el-icon-edit"></i>
                  </span>
                  <span class="el-upload-list__item-preview"
                        @click="$choose(file)">
                    <i class="el-icon-check"
                       v-if="file.checked === false"></i>
                    <i class="el-icon-minus"
                       v-else></i>
                  </span>
                  <span class="el-upload-list__item-preview"
                        @click="$chooseDel(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </li>
            </ul>
            <el-alert v-else
                      center
                      title="暂无文件"
                      description="请查看其它文件夹或者上传新文件"
                      :closable="false"
                      type="warning"
                      show-icon>
            </el-alert>
            <el-pagination :page-sizes="[42, 84]"
                           :page-size="choosePageSize"
                           :current-page="choosePage"
                           @size-change="$chooseSizeChange"
                           @current-change="$choosePageChange"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="chooseRows">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 文件选择2 -->
    <el-dialog :title="customChooseTitle"
               :visible="chooseIng2"
               v-if="chooseCustom"
               append-to-body
               top="4vh"
               width="980px"
               @close="$chooseEnd">
      <ul :class="chooseBoxCls"
          v-loading="chooseDelIng"
          v-if="customFiles.length > 0">
        <li v-for="(file, index) in customFiles"
            :class="['el-upload-list__item', 'is-success','focusing']"
            :key="index">
          <img class="el-upload-list__item-thumbnail"
               :src="file.url"
               alt="">

          <label class="el-upload-list__item-status-label"
                 v-if="uploadFiles.findIndex(fl => fl.url === file.url) > -1">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <span class="el-upload-list__item-actions">
            <!-- <span class="el-upload-list__item-preview"
                  v-else
                  @click="$handleView(file)">
              <i class="el-icon-caret-right"></i>
            </span> -->
            <span class="el-upload-list__item-preview"
                  @click="$choose(file)">
              <i class="el-icon-check"
                 v-if="uploadFiles.findIndex(fl => fl.url === file.url) === -1"></i>
              <i class="el-icon-minus"
                 v-else></i>
            </span>
          </span>
        </li>
      </ul>
      <el-alert v-else
                center
                title="暂无文件"
                :closable="false"
                type="warning"
                show-icon>
      </el-alert>
    </el-dialog>
    <!-- 资源编辑 -->
    <res-form v-if="choose && chooseEditIng && editFile"
              @close="$chooseEditFinish"
              :folders="chooseFolders"
              :item="chooseEditItem">
    </res-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Sortable from 'sortablejs';
import VueCropper from 'vue-cropper';
import ResForm from './res-form';
import { UploaderBuilder } from './qiniu4js';
import accept from './accept';
const status = 'success';
const percentage = 100;

/**
 * 上传到通用文件服务
 * 支持文件剪辑
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
 * todo 文件名不支持，因此使用text模式展示文件时，新上传的文件没有问题，但初始化的文件的文件名是空的
 *
 */

export default {
  name: 'MkUpload2',
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
    // 上传路径
    action: {
      type: String,
      default: 'https://upload.emeker.com/upload'
    },
    // 查看base路径
    viewAction: {
      type: String,
      default: 'https://upload.emeker.com'
    },
    // 上传令牌
    token: {
      type: String
    },
    // 显示文件列表?
    showList: {
      type: Boolean,
      default: true
    },
    // 类型，可取IMAGE、OFFICE、VIDEO、VOICE、GOMEZ、EFECT
    // 参照GlobalValues.RESOURCE_
    type: {
      type: String,
      default: 'IMAGE'
    },
    // 提示文字
    tip: String,
    // 自动显示提示文字
    autoTip: {
      type: Boolean,
      default: true
    },
    // 自动上传?
    autoUpload: {
      type: Boolean,
      default: true
    },
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
    // 文件大小,单位是M,默认根据文件类型设置
    // IMAGE=5,OFFICE=100,video=200,audio=5
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
    // 图片上传质量,默认1，可取0-1
    // 这是上传组件的压缩，与剪切功能无关
    compress: {
      type: Number,
      default: 1
    },
    // picture-card时文件列表的宽度
    width: {
      type: Number,
      default: 148
    },
    // picture-card时文件列表高度
    height: {
      type: Number,
      default: 148
    },
    // 调试
    debug: {
      type: Boolean,
      default: false
    },
    // 预览?
    preview: {
      type: Boolean,
      default: true
    },
    // 剪切?
    cut: {
      type: Boolean,
      default: false
    },
    // 剪切宽度
    cutWidth: {
      type: Number,
      default: 500
    },
    // 剪切高度
    cutHeight: {
      type: Number,
      default: 500
    },
    // 可改变剪切框的宽高?
    cutResize: {
      type: Boolean,
      default: true
    },
    // 宽度高度的比例,默认无比例，自由缩放
    cutFix: {
      type: Array,
      default () {
        return [0, 0];
      }
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
      default () {
        return [];
      }
    },
    // 是否保存上传信息到资源表?
    saveRes: {
      type: Boolean,
      default: true
    },
    // 上传文件自定义保存方法
    saveResFn: Function,
    // 修改文件
    editFile: {
      type: Boolean,
      default: true
    },
    // 开启左右移动
    move: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 挂载的文件列表
      uploadFiles: [],
      // 文件计数变量
      tempIndex: 1,
      // 文件预览框打开与否
      previewIng: false,
      // 预览文件原路径
      preivewSrc: null,
      preivewIndex: -1,
      preivewWidth: 0,
      previewPause: false,
      // 文件预设信息
      accept,
      // 剪切框打开与否
      cutIng: false,
      // 剪切框的原图
      cutImage: null,
      // 正在剪切的任务
      cutTask: null,
      // 上传进度条长度
      percentage: 0,
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
      // 选择文件修改中
      chooseEditIng: false,
      // 选择文件编辑中的资源
      chooseEditItem: null,
      // 选择文件删除中
      chooseDelIng: false,
      // 替换的文件的下标
      replaceIndex: -1,
      // 有锁定的文件夹
      lockFolder: false
    };
  },
  computed: {
    ...mapState({
      tokenGlobal: 'token'
    }),
    // 自己禁用或者所属表单禁用
    uploadDisabled () {
      return this.disabled || (this.elForm || {}).disabled;
    },
    // 只有自己设置为展示文件列表、同时是valueModel时
    // 才展示文件列表
    showFileList () {
      return this.valueModel === true && this.showList === true;
    },
    // 只有multiple时才支持多个文件
    limitFile () {
      return this.multiple === true ? this.limit : 1;
    },
    // 文件上传提示
    fileTip () {
      if (this.tip) return this.tip;
      if (this.autoTip === true && this.choose === false) {
        return `只能上传${ this.accept[this.type].extensions.join(
          '/'
        ) }文件,且不能超过${ this.size || this.accept[this.type].maxFileSize }M`;
      }
      return '';
    },
    // 文件列表宽高
    fileStyle () {
      return {
        width: this.listType === 'card' ? `${ this.width }px` : '',
        height: this.listType === 'card' ? `${ this.height }px` : ''
      };
    },
    // 文件列表操作按钮字体大小
    actionStyle () {
      return {
        fontSize:
          this.listType === 'card'
            ? `${ Math.max(Math.min(this.height / 5, this.width / 5), 10) }px`
            : ''
      };
    },
    // 上传按钮样式
    upStyle () {
      return {
        width:
          !this.$slots.default && this.listType === 'card'
            ? `${ this.width }px`
            : '',
        height:
          !this.$slots.default && this.listType === 'card'
            ? `${ this.height }px`
            : '',
        lineHeight:
          !this.$slots.default && this.listType === 'card'
            ? `${ this.height - 2 }px`
            : ''
      };
    },
    // 上传按钮的cls
    upCardCls () {
      return {
        [`el-upload--${
          this.listType === 'text' ? 'text' : 'picture-card'
          }`]: !this.$slots.default,
        'el-upload': !this.$slots.default,
        'el-upload--noheight': !!this.$slots.default
      };
    },
    // 上传按钮是否显示
    upShow () {
      return (
        isNaN(this.limitFile) ||
        this.limitFile === 0 ||
        this.limitFile > this.uploadFiles.length
      );
    },
    // 显示类型,text/card
    listType () {
      return this.type === 'IMAGE' || this.type === 'GOMEZ' ? 'card' : 'text';
    },
    // 文件选择列表的样式
    chooseBoxCls () {
      return {
        'el-upload-list': true,
        'el-upload-list--picture-card': this.listType === 'card',
        'el-choose-file': true,
        'el-upload-list--text': this.listType === 'text',
        'el-choose-file-img': this.listType === 'card',
        'el-choose-file-text': this.listType === 'text'
      };
    },
    customFiles () {
      return this.customList.map(file => {
        const item = {};
        item.key = this.$genViewKey(file);
        item.checked =
          this.uploadFiles.findIndex(fl => fl.key === item.key) > -1;
        item.url = file;
        item.width = 0;
        item.height = 0;
        return item;
      });
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (vl) {
        // 非valueModel时，跳过操作
        if (this.valueModel === false) return;
        if (vl) {
          // 非多选时，文件是一个字符串，这里强制转为数组
          if (this.multiple === false) vl = [vl];
          const oldFiles = this.uploadFiles.filter(
            item => item.status !== 'success'
          );
          this.uploadFiles = [];
          vl.forEach(url => {
            if (url) {
              const key = this.$genViewKey(url);
              if (this.uploadFiles.findIndex(fl => fl.key === key) === -1) {
                this.uploadFiles.push({
                  status,
                  key,
                  percentage,
                  url
                });
              }
            }
          });
          oldFiles.forEach(item => this.uploadFiles.push(item));
        }
      }
    }
  },
  methods: {
    // 生成查看路径
    $genViewUrl (item) {
      return `${ this.viewAction }?key=${ item }&token=${ this.token ||
        this.tokenGlobal }`;
    },
    // 解析key
    $genViewKey (uri) {
      const arr = uri.match(/key=([0-9a-zA-Z.]+)/);
      if (arr && arr.length === 2) {
        return arr[1];
      }
      return uri;
    },
    // 生成随机key
    $genKey () {
      return Date.now() + this.tempIndex++;
    },
    // 创建上传对象
    $createUploader () {
      if (this.choose === true && this.chooseAndUpload === false) return;
      const maxSize = this.size || this.accept[this.type].maxFileSize;
      const cut = this.type === 'IMAGE' && this.cut === true;
      const uploader = new UploaderBuilder()
        .debug(this.debug)
        .domain({ http: this.action, https: this.action })
        .retry(3)
        .auto(cut === false && this.autoUpload)
        .chunk(true)
        .multiple(cut === false && this.multiple)
        .size(1024 * 1024)
        .accept(this.accept[this.type].extensions)
        .tokenShare(true)
        .tokenFunc(setToken => setToken(this.token || this.tokenGlobal))
        .interceptor({
          onIntercept: task => task.file.size > 1024 * 1024 * maxSize,
          onInterrupt: task => {
            if (task.file.size > 1024 * 1024 * maxSize) {
              this.$message.error(`请上传小于${ maxSize }m的文件`);
              this.$clearFileInput();
              return true;
            }
            return false;
          }
        })
        .interceptor({
          onIntercept: task =>
            this.accept[this.type].mimes.indexOf(task.file.type) === -1,
          onInterrupt: task => {
            if (
              this.accept[this.type].mimes.indexOf(task.file.type) === -1 &&
              this.accept[this.type].match.test(task.file.name) === false
            ) {
              this.$message.error(
                `请上传后缀是${ this.accept[this.type].extensions.join(
                  ' '
                ) }的文件`
              );
              this.$clearFileInput();
              return true;
            }
            return false;
          }
        })
        .listener({
          onReady: tasks => {
            tasks.forEach(task => {
              task.file.key = this.$genKey();
              if (cut === true) {
                this.cutTask = task;
                this.cutImage = URL.createObjectURL(task.file);
                this.cutIng = true;
              }
              // valueModel模式才做本地存贮
              if (this.valueModel === true) {
                const tempFile = {
                  key: task.file.key,
                  name: task.file.name,
                  status: 'ready',
                  percentage: 0,
                  url:
                    this.type === 'IMAGE' ? URL.createObjectURL(task.file) : ''
                };
                if (this.replaceIndex === -1) {
                  this.uploadFiles.push(tempFile);
                } else {
                  this.uploadFiles[this.replaceIndex] = tempFile;
                }
              }
            });
          },
          // 开始上传
          onStart: tasks => {
            if (this.valueModel === false) {
              this.uping = true;
              this.percentage = 0;
            }
          },
          onTaskSuccess: task => {
            const url = this.$genViewUrl(task.result.key);
            // valueModel模式才做本地存贮
            if (this.valueModel === true) {
              const file = this.uploadFiles.find(
                item => item.key === task.file.key
              );
              if (file) {
                file.key = task.result.key;
                file.percentage = 100;
                file.status = 'success';
                file.url = url;
                this.$input();
              }
            } else {
              this.uping = false;
            }
            this.$chooseUpSuc(url, task.file.name);
            this.$emit('success', url, task.file.name, task.result);
            this.$clearFileInput();
          },
          onTaskProgress: task => {
            if (this.valueModel === true) {
              const file = this.uploadFiles.find(
                item => item.key === task.file.key
              );
              file.status = 'uploading';
              file.percentage = task.progress || 0;
            } else {
              this.percentage = task.progress || 0;
            }
          },
          onTaskFail: task => {
            if (this.valueModel === true) {
              const file = this.uploadFiles.find(
                item => item.key === task.file.key
              );
              const fileIndex = this.uploadFiles.findIndex(
                item => item.key === task.file.key
              );
              file.status = 'fail';
              this.uploadFiles.splice(fileIndex, 1);
            }
            this.$message({
              message: '上传失败',
              type: 'error'
            });
            this.$clearFileInput();
          }
        });
      if (this.compress !== 1) {
        uploader.compress(this.compress);
      }
      if (this.compressWidth > 0 || this.compressHeight > 0) {
        uploader.scale([this.compressWidth, this.compressHeight]);
      }
      this.uploaderHandel = uploader.build();
    },
    // 右转
    $cutRotateRight () {
      this.$refs.cropper.rotateRight();
    },
    // 右转
    $cutRotateLeft () {
      this.$refs.cropper.rotateLeft();
    },
    // 剪切
    $cut (ok) {
      if (ok === true) {
        const key = this.cutTask.file.key;
        this.$refs.cropper.getCropBlob(data => {
          this.cutTask.file = data;
          this.cutTask.file.key = key;
          if (this.valueModel === true) {
            const file = this.uploadFiles.find(item => item.key === key);
            file.url = URL.createObjectURL(data);
          }
          this.cutIng = false;
          if (this.autoUpload === true) {
            this.submit();
          }
        });
      } else if (this.autoUpload === true) {
        this.cutIng = false;
        this.submit();
      }
    },
    // 清空文件选择，方便重新选择同一个文件
    $clearFileInput () {
      this.uploaderHandel._fileInput.value = null;
    },
    // 打开用户本地添加文件对话框
    // add= 是否是新增，否则是替换
    // forceAdd= 强制上传，而不是有可能性的选择
    // 自定义选择?
    async $addFile (add, forceAdd, customChoose) {
      if (add === true) {
        this.replaceIndex = -1;
      }
      if (!this.disabled) {
        if (forceAdd === true) {
          this.uploaderHandel.chooseFile();
        } else {
          if (this.choose === true) {
            if (customChoose === true) {
              await this.$startChoose2();
            } else {
              await this.$startChoose();
            }
          } else {
            this.uploaderHandel.chooseFile();
          }
        }
      }
    },
    // 处理移除文件
    $handleRemove (raw) {
      const fileIndex = this.uploadFiles.findIndex(
        item => item.key === raw.key
      );
      const file = this.uploadFiles.find(item => item.key === raw.key);
      this.uploadFiles.splice(fileIndex, 1);
      if (file.status === 'success') {
        this.$input();
        this.$emit('remove', file.url);
      }
      this.previewPause = true;
      this.previewIng = false;
      this.preivewSrc = null;
      this.preivewIndex = -1;
    },
    // 广播v-model改变
    $input () {
      if (this.valueModel === true) {
        const result = [];
        const size = [];
        this.uploadFiles.forEach(item => {
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
    $handleReplace (index) {
      this.replaceIndex = index;
      this.$addFile();
    },
    // 结束预览
    $previewEnd () {
      this.previewPause = true;
      this.previewIng = false;
      this.preivewSrc = null;
      this.preivewIndex = -1;
    },
    // 文件预览
    $handleView (file, index) {
      switch (this.type) {
        case 'OFFICE':
          this.$message({
            message: '不支持预览文档',
            type: 'error'
          });
          break;
        case 'EFECT':
          this.$message({
            message: '不支持预览文档',
            type: 'error'
          });
          break;
        case 'VIDEO':
        case 'GOMEZ':
        case 'IMAGE':
          const img =
            index !== undefined
              ? this.$refs[`file-${ index }`]
              : this.$refs[file.rsid];
          if (img && img[0]) {
            this.preivewWidth = img[0].naturalWidth;
          } else {
            this.preivewWidth = this.cutWidth || this.accept[this.type].width;
          }
          this.previewIng = true;
          this.preivewSrc = file.url;
          this.preivewIndex = index;
          break;
        case 'VOICE':
          this.previewIng = true;
          this.previewPause = false;
          this.preivewSrc = file.url;
          this.preivewIndex = index;
          this.$nextTick(() => {
            this.$refs.audio.play();
          });
          break;
      }
    },
    $lastPreview () {
      this.$handleView(
        this.uploadFiles[this.preivewIndex - 1],
        this.preivewIndex - 1
      );
    },
    $nextPreview () {
      this.$handleView(
        this.uploadFiles[this.preivewIndex + 1],
        this.preivewIndex + 1
      );
    },
    // 启动选择界面
    async $startChoose () {
      this.chooseIng = true;
      this.choosePage = 1;
      await this.$initChooseFolders();
      await this.$chooseLoading();
    },
    // 启动选择界面
    async $startChoose2 () {
      this.chooseIng2 = true;
    },
    // 关闭选择界面
    $chooseEnd () {
      this.chooseIng = false;
      this.chooseIng2 = false;
      this.previewPause = true;
      this.previewIng = false;
      this.preivewSrc = null;
      this.preivewIndex = -1;
    },
    // 选择文件界面 文件列表加载
    async $chooseLoading () {
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
        response.list.forEach(item => {
          item.key = this.$genViewKey(item.rsuri);
          item.checked =
            this.uploadFiles.findIndex(fl => fl.key === item.key) > -1;
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
    async $initChooseFolders () {
      if (this.choose === true) {
        const rstype = this.type;
        const response = await this.$get('query.json', {
          sqlCode: 'cmResourceFolder.select_list',
          rstype,
          sortName: 'cfname',
          sortType: 'asc'
        });
        const fileFloders = response.list;
        const lockid = this.$cache.get(`${ this.type }-lock-folder`);
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
    async $clearLock () {
      this.chooseFolders.forEach(item => {
        item.lock = false;
      });
      this.lockFolder = false;
      this.$cache.remove(`${ this.type }-lock-folder`);
      this.chooseFolder = {};
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 锁定与解锁
    async $lockFolder (folder) {
      // this.$cache.set(`${this.type}-lock-folder`, folder.name)
      // this.chooseFolder = {
      //   cfid: folder.name
      // }
      folder.lock = !folder.lock;
      if (folder.lock === true) {
        this.lockFolder = true;
        this.$cache.set(`${ this.type }-lock-folder`, folder.cfid);
        this.chooseFolder = folder;
      } else {
        this.lockFolder = false;
        this.$cache.remove(`${ this.type }-lock-folder`);
        this.chooseFolder = {};
      }
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 选择文件页面尺寸改变
    async $chooseSizeChange (vl) {
      this.choosePageSize = vl;
      this.choosePage = 1;
      await this.$chooseLoading();
    },
    // 选择文件页码改变
    async $choosePageChange (vl) {
      this.choosePage = vl;
      await this.$chooseLoading();
    },
    // 选择文件界面文件上传后需处理
    // 将文件key提交数据库
    async $chooseUpSuc (rsuri, rsname) {
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
    $chooseEdit (file) {
      this.chooseEditItem = file;
      this.chooseEditIng = true;
    },
    // 选择文件界面选中处理
    $choose (file) {
      const index = this.uploadFiles.findIndex(fl => fl.key === file.key);
      if (index === -1) {
        if (this.limit > 0 && this.uploadFiles.length === this.limit) {
          const lastChecked = this.chooseFiles.find(
            item => item.key === this.uploadFiles[0].key
          );
          lastChecked && (lastChecked.checked = false);
          this.uploadFiles.splice(0, 1);
        }
        this.uploadFiles.push({
          key: file.key,
          name: file.rsname,
          status: 'success',
          percentage: 100,
          url: file.url,
          width: file.width,
          height: file.height
        });
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
    async $chooseNewFolder (cancel) {
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
            this.$cache.set(`${ this.type }-lock-folder`, id.result);
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
    $chooseNewFolderVisible () {
      this.chooseNewFolderVisible = true;
      this.$nextTick(() => {
        this.$refs.chooseFolderInput.$refs.input.focus();
      });
    },
    // 资源编辑完成
    $chooseEditFinish (reload) {
      this.chooseEditIng = false;
      if (reload === true) {
        this.$chooseLoading();
      }
    },
    // 删除
    async $chooseDel (file) {
      this.chooseDelIng = true;
      let data = await this.$delete('cmResource/deleteByid.json', {
        rsid: file.rsid
      });
      if (data) {
        await this.$chooseLoading();
      }
      this.chooseDelIng = false;
    },
    $imgLoad (event, file) {
      file.width = event.target.naturalWidth;
      file.height = event.target.naturalHeight;
      this.$cache.set(file.key, {
        width: file.width,
        height: file.height
      });
    },
    // 对外开放的：上传开始
    submit () {
      this.uploaderHandel.start();
    },
    // 对外开放的：获取文件的宽高
    getSize () {
      const result = [];
      if (this.type === 'IMAGE') {
        this.uploadFiles.forEach((file, index) => {
          const img = this.$refs[`file-${ index }`];
          if (img && img[0]) {
            result.push({
              width: img[0].naturalWidth,
              height: img[0].naturalHeight
            });
          }
        });
      }
      return result;
    },
    // 对外开放的：新增文件
    addFile () {
      this.$addFile(true);
    },
    $left (index) {
      if (index > 0) {
        this.uploadFiles.splice(
          index - 1,
          0,
          ...this.uploadFiles.splice(index, 1)
        );
        this.$input();
      }
    },
    $$left (index) {
      if (index > 0) {
        this.uploadFiles.splice(0, 0, ...this.uploadFiles.splice(index, 1));
        this.$input();
      }
    },
    $right (index) {
      if (index < this.uploadFiles.length) {
        this.uploadFiles.splice(
          index + 1,
          0,
          ...this.uploadFiles.splice(index, 1)
        );
        this.$input();
      }
    },
    $$right (index) {
      if (index < this.uploadFiles.length) {
        this.uploadFiles.splice(
          this.uploadFiles.length - 1,
          0,
          ...this.uploadFiles.splice(index, 1)
        );
        this.$input();
      }
    }
  },
  async mounted () {
    this.$createUploader();
    if (this.$refs.list) {
      const that = this;
      this.sortAble = new Sortable(this.$refs.list, {
        filter: '.menu',
        onStart () {
          that.notDrag = false;
        },
        onEnd ({ oldIndex, newIndex }) {
          that.uploadFiles.splice(newIndex, 0, ...that.uploadFiles.splice(oldIndex, 1));
          that.$input();
        }
      });
    }
  },

  components: {
    VueCropper,
    ResForm
  },
  provide () {
    return {
      uploader: this
    };
  },
  inject: {
    elForm: {
      default: ''
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
