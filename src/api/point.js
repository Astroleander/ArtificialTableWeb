import request from '@/utils/request'
/**
 * @description 分数条目信息的增删改查
 */

/**
 * @description 用于批量导入页面,数据格式较为复杂,会覆盖已有的 point, 别瞎用
 * @params
 *   |- @array lesson_id
 *   |- @array title_list
 *   |- @array sid_list
 *   |- @array point_list
 */
export function importPoints(subjects) {
  return request({
    url: '/point/import_data',
    method: 'post',
    data: subjects
  })
}

/**
 * 查找分数条目信息
 * @params 参数对象
 * （classInfo_id必需，id,student_id,title_id,date,note五个可选参数）
 */
export function getPoints(params) {
  return request({
    url: '/point/format',
    method: 'get',
    params: params
  })
}
/**
 * 通过classInfo_id查询分数条目信息
 */
export function getByClassInfoId(classInfo_id) {
  return request({
    url: '/point/format',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}
/**
 * 通过classInfo_id和student_id查询分数条目信息
 */
export function getByStudentId(classInfo_id, student_id) {
  return request({
    url: '/point/format',
    method: 'get',
    params: {
      classInfo_id: classInfo_id,
      student_id: student_id
    }
  })
}
/**
 * 通过classInfo_id和title_id查询分数条目信息
 */
export function getByTitleId(classInfo_id, title_id) {
  return request({
    url: '/point/format',
    method: 'get',
    params: {
      classInfo_id: classInfo_id,
      title_id: title_id
    }
  })
}
/**
 * 添加一条分数条目信息
 */
export function postPoint(PointItem) {
  return request({
    url: '/point/format',
    method: 'post',
    data: {
      subjects: [PointItem]
    }
  })
}
/**
 * 添加多条分数条目信息
 */
export function postPoints(PointArray) {
  return request({
    url: '/point/format',
    method: 'post',
    data: {
      subjects: PointArray
    }
  })
}
/**
 * 修改一条分数条目信息
 */
export function putPoint(PointItem) {
  return request({
    url: '/point/format',
    method: 'put',
    data: {
      subjects: [PointItem]
    }
  })
}
/**
 * 修改多条分数条目信息
 */
export function putPoints(PointArray) {
  return request({
    url: '/point/format',
    method: 'put',
    data: {
      subjects: PointArray
    }
  })
}
/**
 * 删除一条分数条目信息
 */
export function deletePoint(Point_id) {
  return request({
    url: '/point/format',
    method: 'delete',
    data: {
      subjects: [
        { id: Point_id }
      ]
    }
  })
}
/**
 * 批量删除分数条目信息
 */
export function deletePoints(PointIdArray) {
  return request({
    url: '/point/format',
    method: 'delete',
    data: {
      subjects: PointIdArray
    }
  })
}

/**
* 用于成绩分析中展示各个小项的成绩分布，
* 参数包括classInfo_id和小项ID title_id，返回['0-60','60-70','70-80','80-90','90-100]数据
*/
export function getTitlePoints(classInfo_id, title_id) {
  return request({
    url: '/point/get_Count_point',
    method: 'get',
    params: {
      classInfo_id: classInfo_id,
      title_id: title_id
    }
  })
}

/**
 * 用于班级成绩比较
 */
export function getCompareData(params) {
  var tempObj = request({
    url: '/point/comparison',
    method: 'post',
    data: params
  })
  return tempObj
}

/**
 * 用于成绩导出
 */
export function outPut(classInfo_id) {
  return request({
    url: '/point/output',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}
/**
 * 用于成绩分析界面数据查找更新
 */
export function getWeightData(classInfo_id) {
  return request({
    url: '/point/getWeightData',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}

/**
 * 用于成绩分析界面数据查找更新
 */
export function getWeightChange(classInfo_id) {
  return request({
    url: '/point/getWeightChange',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}

// 获取“预测”按钮里面需要的数据
export function getPrediction(classInfo_id, student_id) {
  return request({
    url: '/point/predict',
    method: 'post',
    data: {
      classInfo: classInfo_id,
      studentId: student_id
    }
  })
}

