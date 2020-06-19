<template>
  <div ref="detailTable"
       v-loading.lock="searching"
       class="detail-table"
       :style="{ height: boxHeight, width }"
       element-loading-text="正在拼命加载">
    <el-table ref="table"
              slot="table"
              :class="{ 'mk-edit-table': mkEdit, 'mk-tree-table': mkTree }"
              :data="list"
              highlight-current-row
              border
              :stripe="stripe && !mkEdit"
              :fit="mkfit"
              width="auto"
              :empty-text="displayemptyText"
              :height="displayHeight"
              :default-expand-all="defaultExpandAll"
              :expand-row-keys="expandRowKeys"
              :default-sort="defaultSort"
              :show-summary="showSummary"
              :sum-text="sumText"
              :summary-method="summaryMethod"
              :span-method="spanMethod"
              :max-height="maxHeight"
              :show-header="showHeader"
              :row-class-name="rowClassName"
              :row-style="rowStyle"
              :cell-class-name="cellClassName"
              :cell-style="cellStyle"
              :header-row-class-name="headerRowClassName"
              :header-row-style="headerRowStyle"
              :header-cell-class-name="headerCellClassName"
              :header-cell-style="headerCellStyle"
              :row-key="rowKey"
              :select-on-indeterminate="selectOnIndeterminate"
              @select="_select"
              @select-all="_selectAll"
              @selection-change="_selectionChange"
              @cell-mouse-enter="_cellMouseEnter"
              @cell-mouse-leave="_cellMouseLeave"
              @cell-click="_cellClick"
              @cell-dblclick="_cellDblclick"
              @row-click="_rowClick"
              @row-contextmenu="_rowContextmenu"
              @row-dblclick="_rowDblclick"
              @header-click="_headerClick"
              @header-contextmenu="_headerContextmenu"
              @sort-change="_sortChange"
              @filter-change="_filterChange"
              @current-change="_currentChange"
              @header-dragend="_headerDragend"
              @expand-change="_expandChange">
      <el-table-column v-if="mkMultiple"
                       type="selection"
                       align="center"
                       width="40" />
      <el-table-column v-if="mkIndex"
                       align="center"
                       type="index"
                       width="50"
                       :label="mkIndexLabel">
        <template slot-scope="{row, $index}">
          {{currentPage | mathSub(1) | mathMul(pageSize) | mathAdd($index, 1)}}
        </template>
      </el-table-column>
      <slot name="before" />
      <slot />
      <div slot="append">
        <slot name="append" />
      </div>
    </el-table>
    <el-pagination v-if="mkPage && list.length > 0"
                   :page-sizes="pageSizes"
                   :layout="mkShowPageSize ? 'total, sizes, prev, pager, next' : 'total, prev, pager, next'"
                   :total="totalRow"
                   :pager-count="pagerCount"
                   :page-size="pageSize"
                   :current-page="currentPage"
                   @size-change="_pageSizeChange"
                   @current-change="_pageCurrentChange" />
  </div>
</template>
<script>
import assign from 'lodash.assign';
import cloneDeep from 'lodash.clonedeep';
import { getValueByPath } from 'element-ui/lib/utils/util';
export default {
  name: 'mk-table',
  props: {
    mkExpanOnlyone: {
      type: Boolean,
      default: false
    },
    // 特殊的一种子表格，这种子表格的padding被设置为0，看起来就像表格树一样
    // 设置在父表格上即可
    mkTree: {
      type: Boolean,
      default: false
    },
    // 是否显示行号
    mkIndex: {
      type: Boolean,
      default: true
    },
    mkIndexLabel: {
      type: String,
      default: '序号'
    },
    // 是否支持多选
    mkMultiple: {
      type: Boolean,
      default: false
    },
    // 是否使用内置分页组件
    mkPage: {
      type: Boolean,
      default: true
    },
    // 远程加载数据的uri
    // 返回数据可以是纯数组，此时意味着在客户端实现假分页或者干脆不分页
    // 返回数据可以是{list,totalRow},此时意味着真分页
    mkUri: {
      type: String
    },
    // 远程导出数据的uri
    // 返回数据可以是纯数组，此时意味着在客户端实现假分页或者干脆不分页
    // 返回数据可以是{list,totalRow},此时意味着真分页
    mkExcelUri: {
      type: String
    },
    // 远程加载数据的sqlCode
    // 不能与mkUri同时使用
    // 格式是sql目录中的文件名.sql语句
    // 例如cpuser.md中的select_list,就是cpuser.select_list
    mkSqlCode: {
      type: String
    },
    // 是否加载中
    // 表格加载中由 远程加载、过滤自动控制，但这个属性的优先级最高
    // 可用来拦截表格自动加载数据
    mkLock: {
      type: Boolean,
      default: false
    },
    // 表格是编辑模式，此时表格中输入框的高度有特殊处理
    // 发生验证错误时，高度自动缩小
    mkEdit: {
      type: Boolean,
      default: false
    },
    // 返回true表示显示这条记录
    // 用于本地数据源时筛选数据
    mkFilter: {
      type: Function
    },
    // 查询之前，对查询条件进行改造的方法
    mkInitSearchData: Function,
    // 显示top修正值
    mkTop: { type: Number, default: 0 },
    // 包含查询条件、查询中
    value: {
      type: Object,
      validator (value) {
        return (
          value &&
          value.hasOwnProperty('searching') &&
          value.hasOwnProperty('searchData')
        );
      }
    },
    // 缓存的id
    mkTableId: {
      type: String,
      default () {
        return `${ +new Date() }${ Math.random() }`;
      }
    },
    // 是否启用缓存模式 默认true
    // 缓存包括条件、页码、页量
    mkCache: {
      type: Boolean,
      default: true
    },
    // 初始被选中的记录
    mkSelect: Array,
    // 调用通用action时，分页/排序语句是否由系统自动拼接?
    // 若=false，则sql语句中需要自己声明参数：limitStart/limitEnd/orderBy来使用分页、排序
    mkLimitSelf: {
      type: Boolean,
      default: false
    },
    // 对每个服务器返回的数据进行改装
    mkDataTransform: {
      type: Function
    },
    // 这是一个mongo表,默认false
    mkMongo: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultSort: {
      type: Object
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: '合计'
    },
    summaryMethod: {
      type: Function
    },
    spanMethod: {
      type: Function
    },
    data: {
      type: Array
    },
    fit: {
      type: Boolean,
      default: true
    },
    height: {
      type: String
    },
    emptyText: {
      type: String
    },
    maxHeight: [String, Number],
    showHeader: {
      type: Boolean,
      default: true
    },
    rowClassName: [Function, String],
    rowStyle: [Function, String],
    cellClassName: [Function, String],
    cellStyle: [Function, String],
    headerRowClassName: [Function, String],
    headerRowStyle: [Function, String],
    headerCellClassName: [Function, String],
    headerCellStyle: [Function, String],
    rowKey: [Function, String],
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    pagerCount: {
      type: Number,
      default: 7
    },
    pageSizes: {
      type: Array,
      default () {
        return [15, 30, 50];
      }
    },
    mkShowPageSize: {
      type: Boolean,
      default: true
    },
    mkPageSize: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      // 本页数据
      list: [],
      // 全部选中的数据
      selectedList: [],
      // 本地数据源过滤之后的记录
      filterList: [],
      // 从第几条开始展示?
      index: 1,
      // 页量
      pageSize: 15,
      // 页码
      currentPage: 1,
      // 总记录数
      totalRow: 0,
      // 宽度,用于子表格+固定列时宽度修正
      width: '100%',
      // 父容器top
      top: 0,
      // 锁定选择变化事件，用于解决选择太快导致的异常
      lockSelectChange: true,
      // 排序相关内容
      sortName: null,
      sortType: null,
      // 当前展开的行
      // 当只允许展开一条记录时使用
      expandRow: null,
      // mkUri的代理
      realUri: null,
      realExcelUri: null,
      // fit的代理
      mkfit: null,
      // data的代理
      realData: null,
      // 记录表格的展开状态
      expandFlag: null,
      expandRowKeys: null,
      // 是否是页码变化引起的刷新
      pageChange: false,
      // 加载中
      loading: true,
      // 是否已经发生过一次：页码错误重新读取的情况?
      reloaded: false
    };
  },
  computed: {
    searching () {
      return ((this.value && this.value.searching !== false) || this.mkLock === true);
    },
    displayHeight () {
      const vl = this.height || `${ process.browser === true ? document.documentElement.clientHeight - this.top - this.mkTop : 0 }`;
      const fix = this.mkPage ? 35 : 0;
      if (!isNaN(vl)) {
        return `${ vl - fix }px`;
      } else if (vl === 'auto') {
        return null;
      } else {
        return vl;
      }
    },
    boxHeight () {
      const vl = this.height || `${ process.browser === true ? document.documentElement.clientHeight - this.top : 0 }`;
      if (!isNaN(vl)) {
        return `${ vl }px`;
      } else if (vl === 'auto') {
        return null;
      } else {
        return vl;
      }
    },
    displayemptyText () {
      return (this.emptyText || (this.loading !== false ? '拼命加载中...' : '亲，没有找到符合条件的记录!'));
    },
    skuSort () {
      return this.mkSkuSort === true ? 'custom' : null;
    }
  },
  watch: {
    'value.searching': {
      async handler (val, oldVal) {
        if (val !== false) {
          await this._searchData(val);
        }
      }
    },
    data: {
      handler (vl) {
        if (vl) {
          this._doSearch(true);
        }
      },
      immediate: false
    },
    mkUri: {
      handler (vl) {
        if (vl) {
          this.realUri = vl;
        }
      },
      immediate: true
    },
    mkExcelUri: {
      handler (vl) {
        if (vl) {
          this.realExcelUri = vl;
        }
      },
      immediate: true
    },
    mkSelect: {
      handler (vl) {
        if (vl) {
          this.selectedList = cloneDeep(vl);
        } else {
          this.selectedList = [];
        }
      },
      immediate: true
    },
    fit: {
      handler (vl) {
        this.mkfit = vl;
      },
      immediate: true
    },
    mkSqlCode: {
      handler (vl) {
        if (vl) {
          if (this.mkMongo === false) {
            this.realUri = '/query.json';
            this.realExcelUri = '/api/excel.xlsx';
          } else {
            this.realUri = '/query-mongo.json';
            this.realExcelUri = '/api/excel-mongo.xlsx';
          }
        }
      },
      immediate: true
    }
  },
  created () {
    if (this.defaultSort) {
      this.sortName = this.defaultSort.prop;
      this.sortType = this.defaultSort.order;
      if (this.sortType) {
        this.sortType = this.sortType.replace('ending', '');
      }
    }

    this.pageSize = this.mkPageSize;
    // 当表格是另一个表格的子表时
    // 当表格有fixright的列时
    // 重新调整表格的宽度
    const maxParent = this.$parent.$parent.$el;
    if (
      maxParent &&
      maxParent.className &&
      maxParent.className.includes('el-table')
    ) {
      const fixRight = maxParent.querySelector('.el-table__fixed-right');
      if (fixRight) {
        this.width = `${ maxParent.clientWidth - fixRight.clientWidth - 50 }px`;
      }
    }
    // 读取缓存
    if (this.mkCache === true) {
      const key = `${ this.mkTableId }-xx`;
      const t = this.$cache.get(key);
      if (t) {
        if (this.value) {
          const searchData = assign({}, this.value.searchData, t);
          this.$emit('input', {
            searchData,
            searching: this.value.searching
          });
        }
        const pageSizeKey = `${ this.mkTableId }-xxx`;
        const currentPageKey = `${ this.mkTableId }-xxxx`;
        const totalRowKey = `${ this.mkTableId }-xxxxx`;
        this.pageSize = this.$cache.get(pageSizeKey);
        this.currentPage = this.$cache.get(currentPageKey);
        this.totalRow = this.$cache.get(totalRowKey);
      }
    }
    // 页码修正
    if (this.mkPage === false && this.mkLimitSelf === false) {
      this.pageSize = null;
      this.currentPage = 1;
    }
    // 行唯一标识符使用
    if (typeof this.rowKey === 'string') {
      this._singel = (d1, d2) => {
        const id1 =
          typeof d1 === 'object' ? getValueByPath(d1, this.rowKey) : d1;
        const id2 =
          typeof d2 === 'object' ? getValueByPath(d2, this.rowKey) : d2;
        return id1 === id2;
      };
    } else if (typeof this.rowKey === 'function') {
      this._singel = (d1, d2) => {
        const id1 = typeof d1 === 'object' ? this.rowKey(d1) : d1;
        const id2 = typeof d2 === 'object' ? this.rowKey(d2) : d2;
        return id1 === id2;
      };
    } else {
      this._singel = () => true;
    }
  },
  mounted () {
    this.top = document.documentElement.clientHeight - 400;
    this.$nextTick(() => {
      // 重新计算表格的top
      if (this.$refs.detailTable) {
        this.top = this.$refs.detailTable.getBoundingClientRect().top;
      }
      // v-model 模式下，只有searching=true，才请求数据
      if (this.value) {
        if (this.value.searching === true || this.value.searching === null) {
          this._searchData(this.value.searching);
        }
      } else {
        // 非v-modle模式下，直接请求数据
        this._searchData(true);
      }
    });
  },
  methods: {
    async _pageSizeChange (v) {
      this.pageSize = v;
      this.currentPage = 1;
      this.pageChange = true;

      this._doSearch(true);
    },
    async _pageCurrentChange (v) {
      this.currentPage = v;
      this.pageChange = true;

      this._doSearch(true);
    },

    _pushSelected (item) {
      this.selectedList.push(item);
      this.$emit('selection-change-row', item, true);
    },
    _select (selection, row) {
      this.$emit('select', selection, row);
    },
    _selectAll (selection) {
      this.$emit('select-all', selection);
    },
    _selectionChange (selection) {
      if (this.lockSelectChange === false) {
        this.list.forEach((row) => {
          const selectedIndex = selection.findIndex((item) =>
            this._singel(item, row)
          );
          const index = this.selectedList.findIndex((item) =>
            this._singel(item, row)
          );
          if (selectedIndex === -1) {
            if (index > -1) {
              this.selectedList.splice(index, 1);
              this.$emit('selection-change-row', row, false);
            }
          } else if (index === -1) {
            this._pushSelected(row);
          }
        });
        this.$emit('selection-change', selection);
      }
    },
    _cellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event);
    },
    _cellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event);
    },
    _cellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event);
    },
    _cellDblclick (row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    _rowClick (row, event, column) {
      this.$emit('row-click', row, event, column);
    },
    _rowContextmenu (row, event) {
      this.$emit('row-contextmenu', row, event);
    },
    _rowDblclick (row, event) {
      this.$emit('row-dblclick', row, event);
    },
    _headerClick (column, event) {
      this.$emit('header-click', column, event);
    },
    _headerContextmenu (column, event) {
      this.$emit('header-contextmenu', column, event);
    },
    async _sortChange ({ column, prop, order }) {
      this.sortName = prop;
      this.sortType = order;
      if (this.sortType) {
        this.sortType = this.sortType.replace('ending', '');
      }
      this.$emit('sort-change', {
        column,
        prop,
        order
      });

      this._doSearch(true);
    },
    _filterChange (filters) {
      this.$emit('filter-change', filters);
    },
    _currentChange (currentRow, oldCurrentRow) {
      if (this.lockSelectChange === false) {
        if (this.mkMultiple === false) {
          const index = this.selectedList.findIndex((item) =>
            this._singel(currentRow, item)
          );
          if (index === -1) {
            this.selectedList.length = 0;
            this._pushSelected(currentRow);
          }
        }
        this.$emit('current-change', currentRow, oldCurrentRow);
      }
    },
    _headerDragend (newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    _expandChange (row, expandedRows) {
      const expanded =
        expandedRows.findIndex((item) => this._singel(item, row)) > -1;
      if (this.mkExpanOnlyone === true) {
        if (expanded === true) {
          if (this.expandRow) {
            this.$refs.table.toggleRowExpansion(this.expandRow, false);
          }
          this.expandRow = row;
        } else {
          this.expandRow = null;
        }
      }
      row.expanded = expanded;
      this.$emit('expand-change', row, expandedRows);
    },
    _dataTransForm (list) {
      if (this.mkDataTransform) {
        list.forEach((item) => {
          this.mkDataTransform(item);
        });
      }
    },
    _setList (data) {
      this.lockSelectChange = true;
      this._dataTransForm(data);
      this.list = data;

      this.$nextTick(() => {
        // 默认选中记录
        this.list.forEach((row, index) => {
          const selectIndex = this.selectedList.findIndex((item) => {
            return this._singel(item, row);
          });
          if (selectIndex > -1) {
            if (this.mkMultiple === true) {
              this.$refs.table.toggleRowSelection(row, true);
            } else {
              this.$refs.table.setCurrentRow(row);
            }
          }
        });
        this.lockSelectChange = false;
      });
    },
    /**
     * 为本地数据提供刷新方法
     */
    _doSearch (searching, callback) {
      if (this.value) {
        this.$emit(
          'input',
          Object.assign({}, this.value, {
            searching
          })
        );
      } else {
        this._searchData(searching, callback);
      }
    },
    async _searchData (searching, callback) {
      this.loading = true;
      let searchData = {};
      // 是否是重置
      const reset = searching === null;
      const allSearch = searching === undefined;
      if (reset) {
        this.clearSelection();
      }
      if (this.value) {
        // v-modle 绑定时，改变值
        this.$emit('begin-fetch');
        searchData = cloneDeep(this.value.searchData);
        if (reset === true) {
          this.$empty(searchData);
        }
        this.$emit('input', {
          searchData,
          searching
        });
        if (searchData) {
          this.$emptyIf(searchData);
          if (this.mkCache === true) {
            this.$cache.set({
              [`${ this.mkTableId }-xx`]: searchData
            });
          }
        }
      }
      if (this.mkInitSearchData) {
        this.mkInitSearchData(searchData, reset);
      }
      if (this.mkLock === true) {
        this.$emit('input', {
          searchData,
          searching: false
        });
        return;
      }
      // 重置时，页码、索引计数归1
      // if (reset === true || this.pageChange === false) {
      if (reset === true || allSearch === true) {
        this.currentPage = 1;
        this.index = 1;
      } else {
        this.pageChange = false;
        // 非重置，索引计数重新计算
        this.index = (this.currentPage - 1) * this.pageSize + 1;
      }
      // 缓存页码、页量
      if (this.mkCache === true) {
        this.$cache.set({
          [`${ this.mkTableId }-xxx`]: this.pageSize,
          [`${ this.mkTableId }-xxxx`]: this.currentPage
        });
      }
      if (this.realUri) {
        // 远程数据
        try {
          const filterData = await this.$get(this.realUri, {
            ...searchData,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            sortName: this.sortName,
            sortType: this.sortType,
            sqlCode: this.mkSqlCode,
            limitSelf: this.mkLimitSelf
          });
          if (filterData.totalRow !== undefined) {
            this.totalRow = filterData.totalRow;
            // bug 修正 因为查询条件变化引起总记录数>0但本页面记录为空时，重新请求一遍
            if (this.totalRow > 0 && filterData.list.length === 0 && this.reloaded === false) {
              this.currentPage = Math.ceil(this.totalRow / this.pageSize);
              this.reloaded = true;
              this._searchData(true);
              return;
            } else {
              this.reloaded = false;
              this._setList(filterData.list);
              if (this.mkCache === true) {
                this.$cache.set({
                  [`${ this.mkTableId }-xxxxx`]: this.totalRow
                });
              }
            }
          } else if (filterData.list) {
            // 服务器返回、本地分页模式
            // this.realUri = null;
            this.realData = filterData.list;
            this._doLocalData(searchData.list);
          } else {
            // 服务器返回、本地分页模式
            // this.realUri = null;
            this.realData = filterData;
            this._doLocalData(searchData);
          }
        } catch (error) {
          console.error(error);
          this.$message('数据加载失败~~~~');
        }
      } else if (this.data) {
        this.realData = this.data;
        this._doLocalData(searchData);
      } else if (this.realData) {
        this._doLocalData(searchData);
      }

      this.$nextTick(() => {
        this.$emit('input', {
          searchData,
          searching: false
        });
        if (callback) {
          callback();
        }
      });
      if (this.expandFlag !== null) {
        this.expandChangeAll(this.expandFlag);
      }
      this.$emit('end-fetch');
      this.loading = false;
    },
    excel (templateName, downLoadName) {
      let searchData = {};
      if (this.value) {
        // v-modle 绑定时，改变值
        searchData = cloneDeep(this.value.searchData);
        if (searchData) {
          this.$emptyIf(searchData);
        }
      }
      if (this.mkInitSearchData) {
        this.mkInitSearchData(searchData);
      }
      const urls = [this.realExcelUri];
      if (this.realExcelUri.indexOf('?') === -1) {
        urls.push('?templateName=');
      } else {
        urls.push('&templateName=');
      }
      urls.push(templateName);
      urls.push('&downLoadName=');
      urls.push(downLoadName);
      urls.push('&sortName=');
      urls.push(this.sortName);
      urls.push('&sortType=');
      urls.push(this.sortType);
      urls.push('&sqlCode=');
      urls.push(this.mkSqlCode);
      urls.push('&devid=');
      urls.push(this.$cache.get(this.$cache.keys.devid));
      for (const k in searchData) {
        if (Object.prototype.toString.call(searchData[k]) === '[object Array]') {
          for (const v of searchData[k]) {
            urls.push('&');
            urls.push(k);
            urls.push('[]=');
            urls.push(v);
          }
        } else {
          urls.push('&');
          urls.push(k);
          urls.push('=');
          urls.push(searchData[k]);
        }
      }
      window.open(urls.join(''));
    },
    _doLocalData (searchData) {
      // 本地数据过滤
      if (this.mkFilter) {
        const list = [];
        this.realData.forEach((item) => {
          if (this.mkFilter(item, searchData) === true) {
            list.push(item);
          }
        });
        this.filterList = list;
      } else {
        this.filterList = this.realData;
      }
      // 记录数
      this.totalRow = this.filterList.length;
      const maxPage = Math.ceil(this.totalRow / this.pageSize);
      // bug 修正 因为查询条件变化引起总记录数>0但本页面记录为空时，重新请求一遍
      if (this.totalRow > 0 && maxPage < this.currentPage && this.reloaded === false) {
        this.currentPage = maxPage;
        this.reloaded = true;
        this._searchData(true);
      } else {
        this.reloaded = false;
        // 排序
        if (this.sortName) {
          this.filterList.sort((a, b) => {
            const av = getValueByPath(a, this.sortName);
            const bv = getValueByPath(b, this.sortName);
            if (this.sortType === 'asc') {
              if (av > bv) {
                return 1;
              } else if (av < bv) {
                return -1;
              } else {
                return 0;
              }
            } else if (av > bv) {
              return -1;
            } else if (av < bv) {
              return 1;
            } else {
              return 0;
            }
          });
        }
        // 分页
        if (this.mkPage === true) {
          const data = this.filterList.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
          this._setList(data);
        } else {
          this._setList(this.filterList);
        }
        if (this.mkCache === true) {
          this.$cache.set({
            [`${ this.mkTableId }-xxxxx`]: this.totalRow
          });
        }
      }
    },

    clearSelection () {
      this.selectedList.length = 0;
      this.$refs.table.clearSelection();
    },
    /**
     * 批量将当前页的子表格展开,或折叠
     * flag = true 展开
     * flag = false 折叠
     */
    expandChangeAll (flag) {
      if (this.rowKey) {
        const list = this.getList();
        const expandRowKeys = [];
        list.forEach((row) => {
          this.toggleRowExpansion(row, flag);
          if (flag) {
            expandRowKeys.push(row[this.rowKey]);
          }
        });
        this.expandRowKeys = expandRowKeys;
        this.expandFlag = flag;
      }
    },
    toggleRowSelection (row, selected) {
      this.$refs.table.toggleRowSelection(row, selected);
    },
    toggleRowExpansion (row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded);
    },
    setCurrentRow (row) {
      this.$refs.table.setCurrentRow(row);
    },
    clearSort () {
      this.$refs.table.clearSort();
    },
    clearFilter () {
      this.$refs.table.clearFilter();
    },
    doLayout () {
      this.$refs.table.doLayout();
    },
    /**
     * 返回选中的全部数据
     * 必须先设置rowKey
     */
    getSelectedList (clone) {
      if (clone === true) {
        return cloneDeep(this.selectedList);
      } else {
        return this.selectedList;
      }
    },
    /**
     * 本页全部数据
     */
    getList () {
      return cloneDeep(this.list);
    },
    /**
     * 假分页或者本地数据分页时,返回过滤后的全部数据
     */
    getFilterList () {
      return cloneDeep(this.filterList);
    },
    /**
     * 假分页或者本地数据分页时，返回全部数据
     */
    getAllList () {
      return cloneDeep(this.data);
    },
    reload () {
      this._doSearch(true);
    },
    clearData () {
      this.list = [];
      this.selectedList = [];
      this.filterList = [];
      // this.list.length = 0;
      // this.selectedList.length = 0;
      // this.filterList.length = 0;
      this.index = 1;
      this.totalRow = 0;
    }
  }
};
</script>
