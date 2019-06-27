import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import course from './modules/course'
import user from './modules/user'
import table from './modules/table'
import Info from './modules/Info'
import getters from './getters'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    course,
    table,
    Info
  },
  getters // 将getters暴露出去
})

export default store
