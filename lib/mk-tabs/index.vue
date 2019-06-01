<template>
  <el-tabs v-if="list.length > 0" v-model="index" :stretch="stretch" :tab-position="tabPosition">
    <el-tab-pane v-for="(item, indexx) in list" :key="indexx" :name="`${indexx}`" lazy :label="typeof mkLabel === 'string' ? item[mkLabel] : mkLabel(item)">
      <slot :data="item" />
    </el-tab-pane>
  </el-tabs>
  <el-alert v-else center :title="displayemptyText" :closable="false" type="warning" show-icon />
</template>
<script>
export default {
  name: 'mk-tabs',
  props: {
    mkLabel: [String, Function],
    mkEmpty: String,
    mkSqlCode: String,
    mkParams: {
      type: Object,
      default() {
        return {};
      }
    },
    mkSortName: String,
    mkSortType: String,
    type: String,
    stretch: {
      type: Boolean,
      default: true
    },
    tabPosition: {
      type: String,
      default: 'top'
    },
    mkData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      list: [],
      index: 0,
      loading: true
    };
  },
  computed: {
    displayemptyText() {
      return this.mkEmpty || (this.loading !== false ? '拼命加载中...' : '亲，没有找到符合条件的记录!');
    }
  },
  async created() {
    const response = await this.$get('/query.json', {
      sqlCode: this.mkSqlCode,
      currentPage: 0,
      pageSize: -1,
      sortName: this.mkSortName,
      sortType: this.mkSortType,
      ...this.mkParams
    });
    this.list = this.mkData.concat(response.list);
    this.loading = false;
  }
};
</script>
