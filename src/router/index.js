/* 路由适用于为各个页面提供查找引用的路径 */
import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* 通过import 引入所有希望建立路由的组件 */
// layout 引入外部框架layout
import Layout from '../views/layout/Layout'
// import { url } from 'inspector'

// url path
// 引入其他路径文件 简写方便
import urls from '@/urls'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

/* 对外输出路由 constantRouterMap为一整个路由数组 其中每个{}为一个路由 path为路由地址 component为跳转组件 */
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true }, // 登录路径；组件模版views/login/index；可隐藏信息
  {
    path: '',
    component: Layout,
    children: [{
      path: '',
      name: 'help',
      component: () => import('@/views/help/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: urls.info,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: '/',
      name: 'change',
      component: () => import('@/views/manager/user/change'),
      meta: { title: '个人信息', icon: 'tree' }
    }]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true } // 错误页面404
]

export const adminRouter = [
  {
    path: '/manager',
    component: Layout,
    meta: { title: '课程组管理', icon: 'tree' },
    children: [
      {
        path: 'lesson/class',
        name: 'classList',
        component: () => import('@/views/manager/classfield/index.vue'),
        meta: { title: '课程组列表', icon: 'lesson' }
      },
      {
        path: 'lesson/addLesson',
        name: 'addlesson',
        component: () => import('@/views/manager/lesson/addLesson.vue'),
        meta: { title: '添加课程组', icon: 'add' }
      },
      {
        path: 'weight',
        name: 'weight',
        component: () => import('@/views/weight/index'),
        meta: { title: '设置权重', icon: 'weight' }
      }]
  },
  {
    path: urls.comparison,
    component: Layout, // 上方引入的外部框架模版
    children: [{
      path: 'index',
      name: 'comparison',
      component: () => import('@/views/comparison/newIndex'),
      // 路由属性存储
      meta: { title: '班级成绩比较', icon: 'score' }
    }]

  },
  /*
  {
    path: '/manager',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'student/list',
        name: 'liststudent',
        component: () => import('@/views/manager/student/list.vue'),
        meta: { title: '学生管理', icon: 'list' }
      }]
  },*/
  {
    path: '/manager/user',
    component: Layout,
    meta: { title: '教师管理', icon: 'tree' },
    children: [
      {
        path: 'add',
        name: 'addmanager',
        component: () => import('@/views/manager/user/add.vue'),
        meta: { title: '添加教师', icon: 'addUser' }
      },
      {
        path: 'list',
        name: 'showmanager',
        component: () => import('@/views/manager/user/list.vue'),
        meta: { title: '教师列表', icon: 'userList' }
      }
    ]
  }
]

export const teacherRouter = [
  {
    path: '/manager',
    component: Layout,
    children: [{
      path: 'class/add',
      name: 'class',
      component: () => import('@/views/manager/classfield/add.vue'),
      meta: { title: '添加教学班级', icon: 'add' }
    }]
  },
  {
    path: urls.class,
    component: Layout,
    children: [{
      path: 'index',
      name: 'class',
      component: () => import('@/views/manager/classfield/listForTeacher'),
      meta: { title: '教学班级信息', icon: 'banjiguanli' }
    }]
  },
  {
    path: '/class',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'classfield/:id',
        name: 'addClassField',
        component: () => import('@/views/manager/classfield/form.vue'),
        meta: { title: '班级添加删除学生', icon: 'tree' }
      }
    ]
  },
  /**
     * 曲线救国，可能是版本过旧的原因反正我这儿 alwaysShow 不好用
     */
  /* {
      path: '/input-wrapper',
      component: Layout,
      children: [{
        path: 'index',
        name: 'input-wrapper',
        // 重定位：用于返回导入成绩时直接返回，用于代替component
        redirect: '/input',
        meta: { title: '导入成绩', icon: 'upload' }
      }]
    },*/
  {
    path: '/mainpage',
    component: Layout, // 上方引入的外部框架模版
    // 创建子路由，进行跳转到菜单相应子模块中
    children: [
      {
        path: 'index',
        name: 'mainpage',
        // 左侧菜单栏中标题和图片应用
        meta: { title: '管理学生成绩', icon: 'chengji' },
        // 连接响应vue文件
        component: () => import('@/views/mainpage/index')
      }]
  },
  {
    path: urls.transcript,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: ':id',
      name: 'transcript',
      component: () => import('@/views/transcript'),
      meta: { title: '成绩管理', icon: 'tree' }
    }]
  },
  {
    path: '/redirector',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'input-wrapper-redirector',
      component: () => import('@/views/redirector'),
      meta: { title: '导入成绩', icon: 'upload' }
    }]
  },
  {
    path: '/input',
    // 重定位：用于返回导入成绩时直接返回
    // redirect: '/input/index',
    meta: { title: '导入成绩', icon: 'upload' },
    component: Layout,
    // hidden: true,
    children: [{
      path: 'index',
      name: 'input',
      meta: { title: '导入成绩', icon: 'upload' },
      component: () => import('@/views/input/index')
    }]
  },
  /* {
          path: urls.input,
          // 重定位：用于返回导入成绩时直接返回
          redirect: 'redirect/index',
          component: Layout,
          children: [{
            path: 'index',
            meta: { title: '导入成绩', icon: 'upload' },
            component: () => import('@/views/input/index')
          }]
        },*/
  /* 暂时屏蔽
  {
    path: urls.analyse,
    component: Layout,
    children: [{
      path: 'index',
      name: 'analyse',
      component: () => import('@/views/analyse/analyse'),
      meta: { title: '课程分析', icon: 'lessonAnalyse' }
    }]
  },
  /**
     * 曲线救国，可能是版本过旧的原因反正我这儿 alwaysShow 不好用
     */
  {
    path: urls.transcript,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: '/predict',
      name: 'predict',
      component: () => import('@/views/transcript/PredictResult'),
      meta: { title: '成绩预测', icon: 'tree' }
    }]
  }
]
export default new Router({
  // mode: 'history', // 后端支持可开 使用可以消除绝对路径url中的'#'符，可选操作
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

