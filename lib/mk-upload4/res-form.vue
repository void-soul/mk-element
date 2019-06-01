<template>
  <el-dialog title="编辑资源详情" append-to-body visible lock-scroll :before-close="handleClose" width="600px">
    <el-form ref="form" v-if="form" :model="form" :label-width="formLabelWidth" :element-loading-text="loadingText" v-loading="busying">
      <el-row type="flex">
        <el-col :span="12">
          <mk-form-item label="资源名称" prop="rsname" :mk-le-length="20" required>
            <el-input v-model="form.rsname"></el-input>
          </mk-form-item>
        </el-col>
        <el-col :span="12">
          <mk-form-item label="资源代码" prop="rscode" :mk-le-length="32">
            <el-input v-model="form.rscode"></el-input>
          </mk-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <mk-form-item label="是否有效" prop="isactive">
            <el-switch v-model="form.isactive" active-value="1" inactive-value="0"> </el-switch>
          </mk-form-item>
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col :span="24">
          <mk-form-item label="文件夹" prop="cfid" :mk-le-length="32">
            <el-select v-model="form.cfid" placeholder="请选择">
              <el-option v-for="item in folders" :key="item.cfid" :label="item.cfname" :value="item.cfid"> </el-option>
            </el-select>
          </mk-form-item>
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col :span="24">
          <mk-form-item label="备注" prop="remark" :mk-le-length="500">
            <el-input v-model="form.remark"></el-input>
          </mk-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <mk-button @click="handleClose">取消</mk-button>
      <mk-button @click="onSubmit" :type="2">保存</mk-button>
    </div>
  </el-dialog>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
export default {
  name: 'cm-resource-form',
  props: {
    item: Object,
    folders: Array
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      formLabelWidth: '100px',
      form: null,
      files: [],
      busying: false,
      loadingText: '保存中..'
    };
  },
  methods: {
    loadData() {
      this.form = clonedeep(this.item);
    },
    async valid() {
      if (!this.validate) {
        this.cmstate = this.form.cmstate === '1';
        let fn = this.$refs.form.validate;
        let nodejs = false;
        this.validate = this.$promise({ fn, nodejs });
      }
      return await this.validate();
    },
    async onSubmit() {
      if (await this.valid()) {
        this.busying = true;
        const cmResource = this.form;
        try {
          let data = await this.$put(`/cmResource/update.json`, {
            cmResource
          });
          if (data) {
            this.$emit('close', true);
          }
        } finally {
          this.busying = false;
        }
      }
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>
