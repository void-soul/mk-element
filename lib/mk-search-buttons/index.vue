<template>
  <mk-inline>
    <template v-if="simply">
      <mk-button :loading="value" :type="1" :size="0" icon="el-icon-refresh" @click="doSearch(true)">
        刷新
      </mk-button>
    </template>
    <template v-else>
      <mk-button :loading="value" :type="2" :size="0" icon="el-icon-search" @click="doSearch">
        筛选
      </mk-button>
      <mk-button :loading="value" :type="1" :size="0" icon="el-icon-refresh" @click="doSearch(true)">
        重置
      </mk-button>
    </template>
  </mk-inline>
</template>
<script>
export default {
  name: 'mk-search-buttons',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    simply: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loading() {
      return this.value !== false;
    }
  },
  methods: {
    doSearch(reset) {
      this.$emit('search', reset);
      this.$emit('input', reset === true ? null : true);
    }
  }
};
</script>
