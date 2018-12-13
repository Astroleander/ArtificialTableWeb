export default {
  classField: config => {
    return classFieldMap.fields
  },
  classInfo: config => {
    return classInfoMap.infos
  }
}
// TODO: classField need add lesson_id
const classInfoMap = {
  infos: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '\u82f1\u8bed\u5b66\u672f\u542c说', teacher_id: '孔老师', lesson_id: 3, year: '2018-2019 春季', month: '', data: '', room: '3-319', cid: '007' },
      { id: 2, name: '\u82f1\u8bed\u5b66\u672f\u542c说', teacher_id: '孔老师', lesson_id: 3, year: '2018-2019 春季', month: '', data: '', room: '3-319', cid: '007' },
      { id: 3, name: '\u82f1\u8bed\u5b66\u672f\u542c说', teacher_id: '孔老师', lesson_id: 3, year: '2018-2019 春季', month: '', data: '', room: '3-319', cid: '007' },
      { id: 4, name: '\u82f1\u8bed\u7535\u5f71\u89c6说', teacher_id: '孔老师', lesson_id: 3, year: '2014-2015 秋季', month: '', data: '', room: '3-319', cid: '007' },
      { id: 5, name: '\u82f1\u8bed\u7535\u5f71\u89c6说', teacher_id: '孔老师', lesson_id: 3, year: '2014-2015 秋季', month: '', data: '', room: '3-319', cid: '007' }
    ],
    count: 5
  }
}

const classFieldMap = {
  fields: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, lesson_id: 3, student_id: 11, classInfo_id: 1 },
      { id: 2, lesson_id: 3, student_id: 12, classInfo_id: 1 },
      { id: 3, lesson_id: 3, student_id: 13, classInfo_id: 1 },
      { id: 4, lesson_id: 3, student_id: 11, classInfo_id: 2 },
      { id: 5, lesson_id: 3, student_id: 12, classInfo_id: 2 },
      { id: 6, lesson_id: 3, student_id: 13, classInfo_id: 2 },
      { id: 7, lesson_id: 3, student_id: 11, classInfo_id: 3 },
      { id: 8, lesson_id: 3, student_id: 12, classInfo_id: 3 },
      { id: 9, lesson_id: 3, student_id: 13, classInfo_id: 3 },
      { id: 10, lesson_id: 3, student_id: 11, classInfo_id: 4 },
      { id: 11, lesson_id: 3, student_id: 12, classInfo_id: 4 },
      { id: 12, lesson_id: 3, student_id: 12, classInfo_id: 4 }
    ],
    count: 12
  }
}
