<!-- Tree Structure of Transcript section -->
<!--
index
  |- div
    |- DONE: head (固定头部)
    |- DONE: radio tag card
    |- DONE: route
      |- DONE: transcript table
      |- DONE: check weight & analysis
-->
<!-- 点击任课班级卡片后跳转页面 -->
<!-- 1、此界面由两部分构成，此时注意状态标志shownTab 有两种状态table/states -->
<!-- 2、ID为tabs flex-tabs的其中两个label标签分别为两个按钮服务 switchMode进行转化shownTab状态，从而进行分别显示-->
<!-- 3、v-show判断此刻如果上方标签选择表格table 成绩表，否则显示states 成绩分析-->
<!-- （1）成绩表利用自定义组件 transcript-table 显示表格，来源于'./table'-->
<!-- （2）成绩分析利用自定义组件 transcript-weight 显示分析图表，来源于'./weight'-->
<!-- 4、fetchDataset()函数执行用于向后台请求数据信息，装载到info与model中-->
<!-- 5、buildTable加载成绩表，buildWeight加载成绩分析-->
<!-- 点击任课班级卡片后跳转页面 -->
<template>
  <div class="transcript-wrapper">
    <!-- <transcript-head
      :info='this.info'
      :table='this.table'
      :titles='this.model.titles'
    >
    </transcript-head> -->
    <!-- 上方的成绩表与成绩分析标签分别点击用于转换两种不同状态模式  type="radio"定义单选按钮 执行操作-->
    <input class="state" @click='switchMode("table")' type="radio" title="tab-one" name="tabs-state" id="tab-one" checked />
    <input class="state" @click='switchMode("stats")' type="radio" title="tab-two" name="tabs-state" id="tab-two" />
    <input class="state" @click='switchMode("predict")' type="radio" title="tab-three" name="tabs-state" id="tab-three" />
    <!-- <input class="state" @click='switchMode("students")' type="radio" title="tab-three" name="tabs-state" id="tab-three" /> -->
    <!-- <input class="state" @click='switchMode("logs")' type="radio" title="tab-four" name="tabs-state" id="tab-four" /> -->

    <!-- 上方的成绩表与成绩分析标签 label中的for用于响应上方的ID值-->
    <div class="tabs flex-tabs">
      <label  for="tab-one" id="tab-one-label" class="tab">成绩表</label>
      <label  for="tab-two" id="tab-two-label" class="tab">成绩分析</label>
      <label  for="tab-three" id="tab-three-label" class="tab">成绩预测</label>
    </div>


    <div id="transcript-container">
      <transition>
        <!-- v-show判断此刻如果上方标签选择表格table 显示table-->
        <transcript-table
        v-show='this.getMode("table")'
        :view='this.table'
        :titles='this.model.titles'
        :info='this.info'
        :message='this.model.message'
        :classinfoId="this.id"
        :outPutExcel="this.outToExcel"
        @onTitleAdded='handleTitleChanged'
        @onExportTable='handleExportTable'
        @onDeletedTitle="handleDeletedTitle"
        >
        </transcript-table>
      </transition>
      <!-- 暂时屏蔽成绩预测 -->
      <transcript-predict
        v-show='this.getMode("predict")'
        :view='this.table'
        :info='this.info'
      >
      </transcript-predict>
      <!--v-show判断此刻如果上方标签选择状态分析states 显示成绩分析-->
      <transcript-weight v-show='getMode("stats")'
                         :report="weightData.report"
                         :avg="weightData.avg"
                         :description="weightData.description"
                         :total="weightData.total"
                         :rate="weightData.rate"
                         :flag="weightData.flag"
                         :titles="titles_without_attendance"
                         :grade-section="weightData.gradeSection"
                         :title-average="weightData.titleAverage"
                         :message='this.model.message'>
      </transcript-weight>
    </div>
  </div>
</template>

<script>
import transcriptHead from './head'
import transcriptTable from './table'
import transcriptWeight from './weight'
import transcriptPredict from './predict'

// import XLSX from 'xlsx'

import viewmodel from '@/viewmodel/table'
import titleViewmodel from '@/viewmodel/title'
import titleGroupViewModel from '@/viewmodel/titlegroups'
import classinfoViewmodel from '@/viewmodel/classinfos'
import lessonanalyseViewModel from '@/viewmodel/lesson'

export default {
  // 页面子模版 由三部分组成 1、表头选择（成绩表、成绩分析）2、成绩表 3、成绩分析
  components: {
    transcriptHead,
    transcriptTable,
    transcriptWeight,
    transcriptPredict
  },
  data() {
    return {
      info: this.getInfo,
      shownTab: 'table',
      loading: true,
      titles_without_attendance: [],
      outToExcel: [],
      model: {
        points: null,
        studentMap: new Map(),
        titles: [],
        titleMap: new Map(),
        titleSumMap: new Map(),
        titleGroupMap: new Map(),
        message: ''
      },
      weightData: {
        report: [], // 文字报告
        avg: 0, // 班级平均分
        rate: 0, // 班级及格率
        total: 0, // 班级总人数
        invalidScore: 0, // 不合法成绩，不在0-100之间
        flag: false, // 若数据不全则显示提示信息，否则显示雷达图
        description: '', // 若不能合法显示的提示信息
        gradeSection: [], // 分数段//  gradeSection[0] 0-60 gradeSection[1] 60-70 gradeSection[2] 70-80 gradeSection[3] 80-90 gradeSection[4] 90-100
        titleAverage: [], // 小项平均分（只计算有成绩的列）
        studentScore: new Map(), // 学生成绩统计
        titlePoint: [] // 按照小项分别统计成绩
      },
      table: [],
      info_attentance: [
        {
          key: 1,
          value: '出勤'
        },
        {
          key: 2,
          value: '缺勤'
        },
        {
          key: 3,
          value: '请假'
        },
        {
          key: 4,
          value: '迟到'
        },
        {
          key: 5,
          value: '其他'
        }
      ]
    }
  },
  watch: {
    shownTab: function(newItem) {
      if (newItem === 'status') {
        this.switchMode('status')
      }
    }
  },
  computed: {
    isShown: function() {
      return !this.loading
    },
    // 传入任课卡片ID 获取班级信息
    getInfo: function() {
      return this.$store.getters.course(this.id)
    },
    // 返回当前路径中transcript/：后的ID值 即跳转页面前选择的任课班级卡片的id
    id: function() {
      return this.$router.currentRoute.params.id
    }
  },
  // 页面加载后的生命周期函数，加载当前任课班级数据
  created() {
    // 要是想好好写这个代码的话可以考虑回滚到 12 月之前的版本
    this.info = this.$store.getters.course(this.id)
    // 当前ID在数据仓库中未找到
    if (this.info === undefined) {
      const class_id = this.id
      // 向后台请求数据
      classinfoViewmodel.requestClassInfos({ id: class_id }).then(res => {
        // 加载数据到info中
        this.info = res && res[0]
      })
    }
    // console.log(this.$store.getters.course(''+1))
  },
  mounted() {
    // 加载成绩表
    this.fetchDataset()
  },
  methods: {
    // 获取当前模式（table/state/predict）
    getMode: function(code) {
      if (code === this.shownTab) return true
      else false
    },
    // 请求成绩分析界面数据
    getWeightData() {
      viewmodel.requestWeightData(this.id)
        .then(response => {
          if (response.total === 0) {
            this.weightData.flag = false
            this.weightData.description = '请检查当前班级学生是否导入'
          } else {
            this.weightData.total = response.total
            this.titles_without_attendance = []
            if (response.titles.length !== 0) {
              response.titles.forEach(title => {
                this.titles_without_attendance.push(title)
                this.weightData.titleAverage.push(parseFloat(title.titleAverage).toFixed(2))
                this.weightData.avg = parseFloat(response.avg).toFixed(2)
                this.weightData.rate = parseFloat(response.rate).toFixed(2) * 100
                this.weightData.gradeSection = response.gradeSection
                this.weightData.flag = true
              })
            } else {
              this.weightData.flag = false
              this.weightData.description = '请检查成绩数据是否导入'
            }
          }
        })
    },
    // 转换模式 table / state / predict
    switchMode: function(code) {
      if (code === 'stats') {
        // 加载成绩分析数据 在数据分析更新后更改到setMode函数中
        this.buildWeight()
      }
      this.shownTab = code
    },
    // 获取文字报告
    getReport() {
      lessonanalyseViewModel.requestAnalyseLessons(this.id).then(response => {
        this.weightData.report = response.report
      })
    },
    // 创建成绩表
    buildTable: function() {
      // build table cell
      // each student map to a row on table
      // console.log('开始创建成绩表')
      this.table = []
      this.outToExcel = []
      this.model.studentMap.forEach(element => {
        const row = {
          // add student info (first two column line of the table)
          student: element,
          point: [],
          totle: 0,
          index: 0
        }
        // add student's point
        if (this.model.points) {
          this.model.points.forEach(pointItem => {
            if (pointItem.student_id === element.id) {
              row.point.push(pointItem)
              // row[pointItem.title_id] = pointItem
            }
          })
        }
        // 设置可导出的数据源
        const outPutRow = {
          student_sid: element.sid,
          student_name: element.name
        }
        if (row.point) {
          row.point.forEach(pointItem => {
            const name = pointItem.title_id
            const value = pointItem.pointNumber
            if (pointItem.title__titleGroup__name === '出勤' || pointItem.title__titleGroup__name === '其他') {
              this.info_attentance.forEach(attetance => {
                if (attetance.key === value) {
                  outPutRow[name] = attetance.value
                }
              })
            } else {
              outPutRow[name] = value
            }
            const result = this.countPoint(pointItem)
            row.totle += result[1]
          })
        }
        if (this.table !== undefined) {
          row.index = this.table.length
        }
        row.index = row.index + 1
        this.outToExcel.push(outPutRow)
        this.table.push(row)
      })
      // console.log('成绩表创建完成')
      // build title
      this.getReport()
    },
    // 由id返回学生信息
    findStudentById(student_id) {
      return this.model.studentMap.get(student_id)
    },
    // 由ID返回返回标头
    findTitleById(title_id) {
      return this.model.titles.find(title => {
        return title.id === title_id
      })
    },
    // 增加小项
    handleTitleChanged(title) {
      titleViewmodel.requestPostTitle(title).then(res => {
        title.id = res.succeed_ids[0].id
        title['titleGroup_message'] = res.succeed_ids[0].titleGroup_message
        viewmodel.requestPoints({ classInfo_id: this.id }).then(result => {
          // console.log('I get classInfo_id' + this.id)
          // console.log('I get new points' + result)
          if (result) {
            this.model.points = result
            this.model.titles.push(title)
            this.buildTable()
          }
        })
      }).catch(error => {
        console.log(error)
        this.$prompt(
          '数据库中已存在此项测试，如果需要进行覆盖, 请在文本框内输入\"确认\"\n此操作将删除数据库中存在的测试项, 此项分数信息都将丢失！',
          '请确认覆盖操作', {
            confrimButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /确认/
          }
        ).then(() => {
          title.override_tag = 1
          titleViewmodel.requestPostTitle(title).then(res => {
            title.id = res.succeed_ids[0].id
            title['titleGroup_message'] = res.succeed_ids[0].titleGroup_message
            this.model.titles.push(title)
          })
        })
      })
    },
    // 导出表格
    handleExportTable(dialogResult) {
    },
    // 删除小项
    handleDeletedTitle(title) {
      this.table.forEach(view => {
        const pointx = view.point.findIndex(item => item.title_id === title.id)
        if (pointx >= 0) {
          view.point.splice(pointx, 1)
        }
      })
      const idx = this.model.titles.findIndex(item => item.id === title.id)
      this.model.titles.splice(idx, 1)
    },
    // 加载成绩表信息
    fetchDataset() {
      Promise.all([
        viewmodel.requestTitles({ classInfo_id: this.id }),
        viewmodel.requestPoints({ classInfo_id: this.id }),
        viewmodel.requestStudents({ classInfo_id: this.id }),
        titleGroupViewModel.requestTitleGroups({ lesson_id: this.info.lesson_id })
        // classinfoViewmodel.requestClassInfos({ id: this.id })
      ])
        .then(result => {
          // console.log('请求所有数据')
          // 获取小项数据
          if (result && result[0]) {
            result[0].forEach(element => {
              this.model.titles.push({ ...element, max: 100 })
              // console.log('1234567654321' + element)
              /** 此处在更改数据分析显示后将屏蔽****/
              if (element.titleGroup_message.name !== '出勤' && element.titleGroup_message.name !== '其他' && element.titleGroup_message.name !== '分组' && element.titleGroup_message.name !== '加分') {
                this.titles_without_attendance.push({ ...element, max: 100 })
              }
              this.model.titleMap.set(element.id, element)
              // console.log('title' + element.id + ' : ' + element.weight + ' titleGroupId = '+ element.titleGroup_id )
              if (this.model.titleSumMap.get(element.titleGroup_id)) {
                const temp = this.model.titleSumMap.get(element.titleGroup_id) + element.weight
                this.model.titleSumMap.set(element.titleGroup_id, temp)
              } else {
                this.model.titleSumMap.set(element.titleGroup_id, element.weight)
              }
              // console.log('titleGroup' + element.titleGroup_id + ' : ' + this.model.titleSumMap.get(element.titleGroup_id))
            })
          }
          // 获取分数数据
          this.model.points = result[1]
          // 获取学生信息
          if (result[2]) {
            result[2].forEach(element => {
              this.model.studentMap.set(element.id, element)
            })
          }
          // this.info = result && result[3] && result[3][0]
          // titleGroupViewModel.requestTitleGroups({ lesson_id: this.info.lesson_id }).then(res => {
          let titleGroupSum = 0
          // 获取大项数据
          if (result[3]) {
            result[3].forEach(element => {
              // console.log('1111111' + element)
              if (element.weight !== '0.00') {
                this.model.message = this.model.message + element.name + '*' + element.weight + '%' + '+'
              }
              // this.model.message = this.model.message + element.name + '*' + element.weight + '%' + '+'
              this.model.titleGroupMap.set(element.id, element)
              titleGroupSum += element.weight
            })
            this.model.message = this.model.message.substring(0, this.model.message.length - 1)
          }
          this.model.titleGroupMap.set('TitleGroupSum', titleGroupSum)
          // })
          // 加载成绩表
          this.buildTable()
        }).catch(err => {
        // DONE: show error page
          console.log(err)
          this.table = []
        })
    },
    // 初始化信息为空 不加载
    init() {
      this.weightData.avg = 0 // 班级平均分
      this.weightData.rate = 0 // 班级及格率
      this.weightData.total = 0 // 班级总人数
      this.weightData.invalidScore = 0 // 不合法成绩
      this.weightData.flag = false // 是否缺少数据
      this.weightData.gradeSection = [] // 分数段
      this.weightData.titleAverage = [] // 小项平均分
      this.weightData.studentScore = new Map() // 学生成绩统计
      this.weightData.titlePoint = [] // 小项成绩统计
      for (let i = 0; i < 5; i++) {
        this.weightData.gradeSection.push(0)
      }
    },
    initTable() {
      // this.table = null
      this.model.message = ''
      this.titles_without_attendance = []
      this.model.points = null
      this.model.studentMap = new Map()
      this.model.titles = []
      this.model.titleSumMap = new Map()
      this.model.titleGroupMap = new Map()
    },
    // 检验当前数据是否合法
    judgeLegal() {
      let flag = false // 数据为空 暂不加载雷达图
      const studentLength = this.model.studentMap.size
      const titleLength = this.model.titleMap.size
      const titleGroupLength = this.model.titleGroupMap.size
      var pointLength
      if (this.model.points === undefined) {
        pointLength = 0
      } else {
        pointLength = this.model.points.length
      }
      this.weightData.total = studentLength
      if (studentLength > 0 && titleLength > 0 && titleGroupLength > 0 && pointLength > 0) {
        flag = true
      } else {
        flag = false
        if (studentLength === 0) {
          this.weightData.description = '当前班级无学生信息'
        } else if (titleGroupLength === 0) {
          this.weightData.description = '请检查成绩类别数据是否全部添加，如若没有，请联系教研室主任'
        } else if (pointLength === 0) {
          this.weightData.description = '请检查成绩数据是否全部导入'
        } else if (titleLength === 0) {
          this.weightData.description = '请检查小项数据是否全部导入'
        }
      }
      return flag
    },
    // 获取学生成绩信息
    buildStudentScore() {
      let flag = false // 判断是否计算出所有学生的成绩，数据为空 暂不加载雷达图
      // let total = 0
      // let num = 0
      this.model.points.forEach(pointItem => {
        // 只计算当前在此班级的学生的分数条目
        if (this.model.studentMap.get(pointItem.student_id)) {
          const temp = this.countPoint(pointItem)
          // console.log('currentPoint ' + pointItem.id + '= ' + temp[0])
          // console.log('currentPoint ' + pointItem.id + '= ' + temp[1])
          // console.log('currentPoint ' + pointItem.id + '= ' + pointItem.student_id)
          if (temp[0]) {
            // 该分数条目计算成功
            if (this.weightData.studentScore.get(pointItem.student_id)) {
              const studentScore = this.weightData.studentScore.get(pointItem.student_id) + temp[1]
              this.weightData.studentScore.set(pointItem.student_id, studentScore)
              // console.log(' console.log(this.weightData.studentScore.get(pointItem.student_id=' + pointItem.student_id + ')) = ' +
              //   this.weightData.studentScore.get(pointItem.student_id))
            } else {
              // console.log(' console.log(this.weightData.studentScore.get(pointItem.student_id=' + pointItem.student_id + ')) = ' + temp[1])
              this.weightData.studentScore.set(pointItem.student_id, temp[1])
              // num++
            }
            // total += temp[1]
          }
        }
      })
      flag = true
      //    this.weightData.avg = Math.round(total / num)
      return flag
    },
    // 建立条状图，判断分区
    buildBarData() {
      this.weightData.studentScore.forEach(score => {
        this.judgeSum(score)
      })
    },
    // 计算小项平均分
    buildTitleAverage() {
      this.model.titles.forEach(element => {
        const titleInfo = { id: element.id, name: element.name, title__titleGroup__name: element.titleGroup_message.name, sum: 0, avg: 0, num: 0 }
        this.model.points.forEach(pointItem => {
          if (pointItem.title_id === element.id) {
            titleInfo.num++
            titleInfo.sum += pointItem.pointNumber
          }
        })
        // 若此小项下有分数条目，则将分析的结果存入
        if (titleInfo.num !== 0) {
          titleInfo.avg = Math.round(titleInfo.sum / titleInfo.num)
          // console.log(titleInfo.name)
          // console.log(titleInfo.avg)
          if (titleInfo.title__titleGroup__name !== '分组' && titleInfo.title__titleGroup__name !== '出勤' && titleInfo.title__titleGroup__name !== '加分') {
            this.weightData.titleAverage.push(titleInfo.avg)
          }
          this.weightData.titlePoint.push(titleInfo)
        }
      })
    },
    // 获取及格率
    getPassExamRate: function() {
      const validScore = this.weightData.studentScore.size
      return Math.round((validScore - this.weightData.gradeSection[0]) * 100 / validScore)
    },
    // 判断分数区间
    judgeSum(sum) {
      if (sum >= 0 && sum < 60) {
        this.weightData.gradeSection[0]++
      } else if (sum >= 60 && sum < 70) {
        this.weightData.gradeSection[1]++
      } else if (sum >= 70 && sum < 80) {
        this.weightData.gradeSection[2]++
      } else if (sum >= 80 && sum < 90) {
        this.weightData.gradeSection[3]++
      } else if (sum >= 90 && sum < 100) {
        this.weightData.gradeSection[4]++
      } else { // 不合法分数
        this.weightData.invalidScore++
      }
    },
    // 计算一条分数信息的实际得分
    countPoint(pointItem) {
      let flag = false
      let score = 0 // 分数
      const title_id = pointItem.title_id
      // 根据分数的title_id得到小项及其权重
      if (this.model.titleMap.get(title_id)) {
        const title = this.model.titleMap.get(title_id)
        const titleWeight = title.weight
        const titleGroupWeight = title.titleGroup_message.weight
        // 根据小项的titleGroup_id得到大项及其权重
        if (titleGroupWeight) {
          score = pointItem.pointNumber * titleWeight * titleGroupWeight / 10000
          // console.log(score)
          flag = true
        } else {
          // 若无法根据小项中的titleGroup_id获取大项
          // 计算成绩失败,给出提示信息
          this.weightData.description = '请检查成绩类别数据是否全部导入'
        }
      } else {
        // 若无法根据分数中的title_id获取小项
        // 计算成绩失败,给出提示信息
        this.weightData.description = '请检查小项数据是否全部导入'
      }
      return [flag, score]
    },
    print(lable, msg) {
      console.log(lable + ' = ' + msg)
    },
    // 加载成绩分析数据
    buildWeight: function() {
      // 初始化
      this.init()
      // 判断是否可以继续成绩分析
      // if (this.judgeLegal()) {
      // 加载每个学生成绩表，计算总分平均分
      // this.buildStudentScore()
      this.getWeightData()
      // 计算各个分段学生人数
      // this.buildBarData()
      // 若全部学生的成绩都计算出，计算小项平均值
      // this.buildTitleAverage()
      // 若小项平均值计算完成,可显示雷达图显示小项信息，计算及格率
      // this.weightData.flag = true
      // this.weightData.rate = this.getPassExamRate()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.transcript-wrapper {
  background: white;
}

.state{
  position: absolute;
  left: -10000px;
}

.flex-tabs{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .tab{
    opacity: 0.6;
    flex-grow: 0.5;
    max-width: 200px;
    max-height: 40px;
    transition: 0.3s ease-in-out;
  }
}

.tab {
  display: inline-block;
  vertical-align: top;
  padding: 10px;
  cursor: hand;
  cursor: pointer;
  border-bottom: 4px solid #fff;
}

#tab-one:checked ~ .tabs #tab-one-label,
#tab-two:checked ~ .tabs #tab-two-label,
#tab-three:checked ~ .tabs #tab-three-label,
#tab-four:checked ~ .tabs #tab-four-label{
    cursor: default;
    opacity: 1;
    transition: 0.3s ease-in-out;
    border-color: #69be28;
}

</style>
