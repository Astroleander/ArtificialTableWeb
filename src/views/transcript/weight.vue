<!-- Tree Structure of weight and analysis page of Transcript section  -->
<!--
table
    |- div
        |- DONE: menu
        |- DONE: table
            |- ... DONE: row
-->
<!-- 成绩分析模版 -->
<!-- 1、成绩分析条形图 自定义组件 at-bar 来源于Bar.vue-->
<!-- 2、成绩分析数据图 -->
<!-- 3、成绩分析雷达图 自定义组件 at-radar 来源于radar.vue-->

<!-- 用于为用户定义成绩分析的自定义组件模版 -->
<!--suppress ALL -->
<template>
  <div style="background-color: #dbdbdb">
  <div class="frame">
    <div class="col" v-if="flag">
        <el-card style="margin-top: 5px;" class="flex-80">
            <!--雷达图-->
            <div style="display: flex; align-items: center; justify-content: space-around">
                <at-radar :title-data="titles" :data-set="titleAverage"></at-radar>
                <div>
                    <el-select v-model="value" placeholder="请选择测试名称" @change="selectedTitle">
                        <el-option
                            v-for="item in titles"
                            :key="item.title__id"
                            :label="item.title__name"
                            :value="item.title__id">
                        </el-option>
                    </el-select>
                    <pie-for-title  :data-set="this.dataForTest" :title-text="this.titleText"></pie-for-title>
                </div>
            </div>
        </el-card>

        <el-card class="flex-80" style="margin-top: 5px">
            <div style="display: flex;flex-direction: row; justify-content: space-around">
                <div style="width: 30%">
                    <!--<span>学生统计信息</span>
                    <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    <!--<p><span>学生总人数：{{total}}</span></p>
                    <p><span>总分及格率：{{rate}}%</span></p>
                    <p><span>总分平均分：{{avg}}</span></p>
                    <p><span>总分计算方式：</span></p>
                    <p><span>{{message}}</span></p>-->
                    <el-head style="font:italic bold 18px/28px arial">课程文字报告：</el-head>
                    <el-main style="margin-bottom: -30px">&nbsp&nbsp&nbsp&nbsp{{report[0]}}</el-main>
                    <el-main style="margin-top: -30px;">&nbsp&nbsp&nbsp&nbsp{{report[1]}}</el-main>
                </div>
                <at-bar  :data-set="gradeSection"></at-bar>
                <!--<pie-for-weight  :data-set="gradeSection" :title-text="totleText"></pie-for-weight>-->
                <at-fun :data-set="gradeSection"></at-fun>
            </div>
        </el-card>
      <!-- 人数、成绩、及格率、平均分信息 -->
    </div>
    <!--数据无效警告 -->
    <el-card  class="card-box" v-if="!flag">
      <div slot="header" class="clearfix">
        <span>信息提示</span>
      </div>
      <div class="text">
        <el-alert
          :title="message"
          :description="description"
          type="error"
          :closable="false"
          center
          show-icon>
        </el-alert>
      </div>
    </el-card>
  </div>
  </div>
</template>

<script>
import AtRadar from './radar'
import AtBar from './Bar'
import AtFun from './funnel'
import PieForWeight from './pieForWeight'
import PieForTitle from '@/components/Pie'
import viewmodel from '@/viewmodel/point'

export default {
  name: 'transcriptWeight',
  components: { AtBar, AtRadar, AtFun, PieForWeight, PieForTitle },
  props: {
    // 是否显示提示卡片
    flag: {
      type: Boolean,
      default: false
    },
    // 卡片提示信息
    description: {
      type: String,
      default: ''
    },
      //文字报告
      report:{
          type: Array,
          default: () => []
      },
    // 班级平均分
    avg: {
      type: Number,
      default: 0
    },
    // 班级总人数
    total: {
      type: Number,
      default: 0
    },
    // 班级有效成绩
  /*  valid: {
      type: Number,
      default: 0
    },  */
    // 计算方式
    message: {
      type: String,
      require: true
    },
    // 及格率
    rate: {
      type: Number,
      default: 0
    },
    // 小项的信息，包含name，max
    titles: {
      type: Array,
      default: () => []
    },
    // 小项平均分
    titleAverage: {
      type: Array,
      default: () => []
    },
    // 成绩分组
    gradeSection: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 返回当前路径中transcript/：后的ID值 即跳转页面前选择的任课班级卡片的id
    id: function() {
      return this.$router.currentRoute.params.id
    }
  },
  data() {
    return {
      message: '数据不全，请完善数据后分析成绩',
      totleText: '学生总成绩分布占比',
      value: '',
      dataForTest: [],
      titleText: '各项测试分数分布'
    }
  },
  methods: {
    selectedTitle() {
      viewmodel.requestTitlePoints(this.id, this.value)
        .then(response => {
          this.dataForTest = []
          response.forEach(element => {
            this.dataForTest.push(element)
          })
          // console.log('33333' + this.dataForTest)
        })
      // this.titleText = '1654324565432'
    },
  }
}
</script>

<style lang="scss" scoped>
.card-box{
  height: 300px;
  width: 40%;
  min-width: 300px;
  margin: 40px;
}
.radar-box{
  height: 380px;
  width: auto;
  min-width: 380px;
}
.frame{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
}
.row-box{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content:center;
  height: 500px;
}
.col{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  // align-content:center;
  justify-content: space-around;
  // height: 400px;
}
.bar-box{
  //float: left;
  width: 400px;
  height: 300px;
  // margin-left: 5;
}
.flex-half {
    float: left;
    width: 50%;
    background: white;
}

.flex-80 {
    // display: flex;
    // flex-direction: row;
    // float: left;
    // margin-left: 5px;
    // margin-right: 10px;
    width: 99.3%;
    height: calc((100vh - 110px) / 2);
    //justify-content: space-around;
    align-items: center;
    background: white;
}

.flex-15 {
    float: left;
    width: 15%;
}
</style>
