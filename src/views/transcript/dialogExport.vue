<!--成绩导出模版-->
<template>
<el-dialog title="导出成绩" :visible.sync="visible" :before-close="onDialogClose">
    <el-input v-model="filename" placeholder="文件名" autoComplete="off" maxlength="15" show-word-limit>
      <template slot="append">.xlsx</template>
    </el-input>
  <div slot="footer" class="dialog-footer">
    <el-button @click="onDialogClose">取 消</el-button>
    <el-button type="primary" @click="onExport">导 出</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      filename: ''
    }
  },
  methods: {
    onDialogClose: function() {
      // reset cell_copy and validator
      this.$emit('onDialogClose')
    },
    onExport: function() {
      const filename = this.filename
      if (filename === '') {
        this.$alert('导出文件名不能为空！')
      } else {
        this.$emit('onExport', { filename })
        this.onDialogClose()
      }
    }
  }
}
</script>

<style>

</style>
