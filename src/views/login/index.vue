<!-- 页面思想

    登录：当用户填写完账号和密码后向服务端验证是否正确，
    验证通过之后，服务端会返回一个token，
    拿到token之后（我会将这个token存贮到cookie中，保证刷新页面后能记住用户登录状态），
    前端会根据token再去拉取一个 user_info 的接口来获取用户的详细信息（如用户权限，用户名等等信息）

    动态路由加载
    权限验证：通过token获取用户对应的 role，动态根据用户的 role 算出其对应有权限的路由，通过 router.addRoutes 动态挂载这些路由
-->

<!--登录界面运行过程   -->
<!--  1、模版构建界面  -->
<!--     输入的用户名、密码绑定LoginForm，点击/回车触发handleLogin函数

<!--  2、在判断输入符合规则的情况下，调用@/viewmodel/login.js中的requestLogin请求登录函数将LoginForm作为参数传递过去
<!--  3、@/viewmodel/login.js 中requestLogin函数返回return new Promise((resolve, reject)=>{}
<!--     此时调用@/api/login.js中的login函数，向后端发出request请求
<!--  4、成功得到回复后将数据封装
<!--     const data = response && response.subjects
<!--  5、之后调用@/api/user.js中的getUserInfoWithOutPwd()函数 传入data的ID以及 data.token
<!--     向后端发出request请求返回用户信息
<!--  6、将返回信息response数据提交到store中进行存储
<!--  7、利用$router.push进行页面跳转，跳转到主页面 登录成功-->

<!--   之后的界面注释对于axios的解释掠过，可直接按照viewmodel中的请求路径直接查找请求-->
<!--  登录界面  -->
<template>
  <div class="login-container">
    <!-- autoComplete="on" 规定启用自动完成功能。 -->
      <div style="display: flex;flex-direction: column; width: 520px; background-color: white; justify-content: center; height: calc(100vh - 100px); margin-top: 50px">
          <div style="height: 40%" class="img">

          </div>
          <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
              <!-- 在登录页面框架中显示系统名称：英语课程成绩管理系统 -->
              <h2 class="title">{{AppName}}</h2>
              <!-- 用户名组件 -->
              <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                <!-- 引用Iconfont库中.svg文件 标签为svg-icon 通过icon-class直接通过svg图片名字调用 此处加入用户标志图片-->
                <svg-icon icon-class="user" />
                </span>
                  <!-- 输入用户名，同时双向绑定到loginForm.username中，此时loginForm.username与输入值相同 -->
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
              </el-form-item>
              <!-- 密码组件 -->
              <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"></svg-icon>
                 </span>
                  <!-- 输入密码后回车触发函数handleLogin -->
                  <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                            placeholder="password"></el-input>
                  <!-- 点击eye图片显示密码 -->
                  <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
              </el-form-item>
              <!-- 按钮组件 -->
              <el-form-item>
                  <!-- 点击按钮触发函数handleLogin -->
                  <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                      进入系统
                  </el-button>
              </el-form-item>
          </el-form>
      </div>
      <div>
       <!--   <a href="http://www.beian.miit.gov.cn" style="color: white;margin-left: 350px">京ICP备19048729号</a > -->
          <a href="http://www.beian.miit.gov.cn" style="color: white;margin-left: 350px">BJTUICP备20011301</a>
      </div>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import ViewModel from '@/viewmodel/login'
import { Message } from 'element-ui'
import Vue from 'vue'

// 判断用户名至少三位 isvalidUsername()函数在@/utils/validate文件中
const validateUsername = (rule, value, callback) => {
  if (!isvalidUsername(value)) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
// 判断密码不得少于5位
const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}

export default {
  name: 'login',
  data() {
    return {
      AppName: '英语课程智慧管理平台',
      loginForm: {
        // 在输入用户名，密码时v-model绑定数据
        username: null,
        password: null
      },
      // 登录账号输入符合上述函数规则
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    // 点击图片转换密码显示形式
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // LOGIN EVENT CHAIN
    // 1. Click event
    // 2. * call callback 'handleLogin'
    // 3. validate form
    // 4. view requests viewmodel layer to login
    // 5. viewmodel requests vuex dispatcher
    // 6. vuex dispatcher requests login api remote server
    // 处理 登录函数
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
      // this.loginForm.validate(valid => {
        // 判断输入用户名，密码是否符合规则
        if (valid) {
          // 符合输入规范 加载
          this.loading = true
          // login.vue 获取用户名 密码 ->
          // login view model 调用请求函数 -> vuex dispatcher -> remote
          // 调用请求函数判断是否在数据库中
          ViewModel
            .requestLogin(this.loginForm)
            .then(response => {
              const role = response.is_manager
              // console.log('登陆验证权限：' + role)
              // 登录用户名 密码匹配后
              // 在修改数据之后立即使用这个方法，获取更新后的 DOM，同理setTimeout()
              Vue.nextTick(resolve => {
                // 异步跳转到主页面
                setTimeout(() => {
                  this.$router.push({ path: '/' })
                  this.loading = false
                }, 1500)
              })
            }).catch(err => {
              // 用户名密码不与数据库匹配，加载失败
              this.loading = false
              console.error(err)
            })
        } else {
          // 不符合输入规范
          Message.error({
            message: '用户名或密码不符合规则，请校验',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray: #ffffff;
$black: rgb(28, 31, 8);
/* reset element-ui css */
// 登录界面样式设置
.login-container {
  // 背景图片加载
  background: url("../../assets/images/login-background.jpg");
  background-repeat: no-repeat;
  // background-size: cover;
  // 输入格式设定
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.47);
    border-radius: 2px;
    color: #454545;
  }
  .el-button{
    border-radius: 0px;
    background: $black;
    border: none;
    transition: 0 2s ease-in-out;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$white:#FFF;
$light_gray: #000000;

.img{
    background: url("../../assets/images/login-background.jpg");
    background-size: cover;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
    align-items: center;
  //background-color: $bg;
  .login-form {
    // position: absolute;
    //left: 0;
    //right: 0;
    width: 450px;
    padding: 35px 35px 35px 35px;
    margin: 35px 35px auto 35px;
    //border: 3px solid ;
      //border-style:outset;
      // border-radius: 20px;
      // box-shadow: 0 0 9px #222;
    // background-color: white;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $white;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $white;
    cursor: pointer;
    user-select: none;
  }
}
</style>
