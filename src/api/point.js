import request from '@/utils/request'

export function getPoint(class_id) {
  return request({
    url: '/point/format',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}
