<!--新增列项组件模版-->
<template>
  <el-dialog title="添加新的列项" :visible.sync="visible" :before-close="onDialogClose" class="dialog-form">
  <el-form :rules="rules" :model="titleForm" ref="form">
    <div class="form_addTitle">
    <el-form-item label="新列名称:" prop="name">
      <el-input v-model="titleForm.name" autoComplete="off" size="small" maxlength="30"show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="所属成绩类别:" prop="titleGroup_id">
      <el-select v-model="titleForm.titleGroup_id" placeholder="请选择小项所属的分数类别" size="small" style="width: 100%">
        <el-option v-for='titleGroup in titleGroupList' :key='titleGroup.id'
          :label='titleGroup.name' :value='titleGroup.id'>
        </el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="小项的总分" prop="titleGroup_id">
      <el-input v-model.number="titleForm.total" style="width:100px"
        type="number" prop="number"
        placeholder="总分" size="small" class="title-text"/>
    </el-form-item>
    <el-form-item label="默认权重" prop="weight">
      <span>{{titleForm.weight}}</span>
    </el-form-item> -->
    </div>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="onDialogClose">取 消</el-button>
    <el-button type="primary" @click="onAddNewTitle('form')" :disabled="disabled_button">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import titleGroupViewModel from '@/viewmodel/titlegroups'

const titlePrototype = {
  name: '',
  titleGroup_id: null,
  classInfo_id: null,
  weight: 10,
  total: 100
}
const validateName = (rule, value, callback) => {
  if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
    callback(new Error('小项名称不可为空'))
  } else {
    callback()
  }
}
export default {
  props: ['visible', 'classInfo'],
  data() {
    return {
      disabled_button: false,
      titleForm: titlePrototype,
      titleGroupList: [],
      rules: {
        name: [
          { required: true, message: '请输入小项名称', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateName }
        ],
        titleGroup_id: [
          { required: true, message: '请选择小项所属的分数类别', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onDialogClose: function() {
      // reset cell_copy and validator
      this.$refs.form.resetFields()
      this.$emit('onDialogClose', false)
    },
    onAddNewTitle: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.disabled_button = true
          this.titleForm.name = this.titleForm.name.replace(/\s*/g, '')
          this.titleForm['classInfo_id'] = this.classInfo.id
          this.titleForm['override_tag'] = 0
          this.$emit('onAddNewTitle', JSON.parse(JSON.stringify(this.titleForm)))
          this.onDialogClose()
        } else {
          return false
        }
      })
    },
    fetchTitleGroupList: function() {
      const lessonId = this.classInfo && this.classInfo.lesson_id
      titleGroupViewModel.requestTitleGroups({ lesson_id: lessonId }).then(list => {
        this.titleGroupList = list
        this.titleForm.titleGroup_id = this.titleGroupList[0].id
      }).catch(err => {
        console.error(err)
        this.$message({
          message: err,
          type: 'error'
        })
      })
    }
  },
  created() {
    this.fetchTitleGroupList()
  }
}
</script>

<style lang="scss">

    .form_addTitle {
        .el-input__inner{
            background-color: rgba(255, 232, 143, 0.94);
        }
    }
</style>
