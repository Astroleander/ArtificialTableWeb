<!--
supplement:
（1）院系id使用当前管理员的college_id
（2）权限默认是无管理权限
-->
<!-- 管理员添加教师信息 -->
<template>
  <div class="rowframe">
    <el-card class="form-box">
    <div slot="header">
      <span class="rowframe title">添加教师（初始密码6个1）</span>
    </div>
    <el-form style="width: 50%; margin-left: 25%;" :rules="rules"   ref="ruleForm" :model="form">
        <div class="form">
            <span style="color: red">*必填项</span>
            <el-form-item label="教师姓名:" prop="name" style="max-height: 65px">
                <el-input v-model="form.name"  placeholder="请输入教师姓名"></el-input>
            </el-form-item>
            <el-form-item label="教师编号:" prop="tid" required style="max-height: 65px">
                <el-input v-model="form.tid" placeholder="请输入教师编号(至少四位数字)"></el-input>
            </el-form-item>
            <el-form-item label="输入密码:" prop="password" required style="max-height: 65px">
                <el-input v-model="form.password" type="password" placeholder="输入密码" maxlength="18" show-password="true"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="repassword" required style="max-height: 80px">
                <el-input v-model="form.repassword" type="password" placeholder="初始密码为111111，如不更改请确认再次输入密码" maxlength="18" show-password="true"></el-input>
            </el-form-item>
      </div>
      <!--<el-form-item label="管理员权限" prop="is_manager">-->
        <!--<el-switch v-model="form.is_manager"></el-switch>-->
      <!--</el-form-item>-->
      <span style="margin-top: 10px">选填项</span>
      <el-form-item label="教师邮箱：" prop="email" style="max-height: 65px">
        <el-input v-model="form.email" placeholder="请输入邮箱" ></el-input>
      </el-form-item>
      <el-form-item label="教师电话：" prop="mobile" style="max-height: 65px">
        <el-input v-model="form.mobile" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userViewModel from '@/viewmodel/user'
const validateName = (rule, value, callback) => {
  if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
    callback(new Error('教师名称不可为空'))
  } else {
    callback()
  }
}
export default {
  data() {
    var validateTeacherId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入教师编号'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'))
      } else {
        const tidReg = /^\d{4,}$/
        if (tidReg.test(value)) {
          callback()
        } else {
          callback(new Error('教师编号至少四位，且不可输入空格'))
        }
      }
      callback()
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        // 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
        // const passReg = /\w{4,20}/
        const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
        if (passReg.test(value)) {
          callback()
        } else {
          callback(new Error('密码长度在6~18之间，且需要同时存在字母，和数字'))
        }
        callback()
      }
    }
    var validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
      // Number.isInteger是es6验证数字是否为整数的方法,
      // 前面加了一个+实现隐式转换
        const phoneReg = /^1(3|4|5|7|8)\d{9}$/
        if (!Number.isInteger(+value)) {
          callback(new Error('输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }
    }
    return {
      form: {
        name: '',
        tid: '',
        password: '111111',
        repassword: '',
        // is_manager: '',
        email: '',
        mobile: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateName }
        ],
        tid: [
          { validator: validateTeacherId, trigger: 'blur' }
        ],
        // 密码暂时不设置限制
        password: [
          { trigger: 'blur' }
        ],
        repassword: [
          { validator: validateRePassword, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_collegeId',
      'token'
    ])
  },
  methods: {
    // 添加用户
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const Teacher = { ...this.form, college_id: this.user_collegeId }
          userViewModel.requestPostUser(Teacher).then(response => {
            if (response === undefined) {
              return
            }
            this.$message({
              message: '添加用户成功',
              type: 'success'
            })
            this.$router.push({ path: 'list' })
          })
        } else {
          return false
        }
      })
    },
    // 重置表单
    onReset() {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss">
.title{
  font-weight: bold;
  font-size: larger;
}
.rowframe{
  display: flex;
  flex-direction: row;
  justify-content:center;
}
.form-box{
    width: 100%;
    //min-width: 500px;
    // padding: 20px;
    height: calc(100vh - 50px);
  // min-width: 500px;
  // padding: 20px;
  /*border: 1px solid #999999;*/
}
.form{
    .el-input__inner{
        background-color: rgba(255, 232, 143, 0.94);
    }
    .el-form-item__content{
    }
}
</style>
