const getters = {
  // app status
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // user cookies
  token: state => state.user.token,
  name: state => state.user.name,
  id: state => state.user.id,
  user: state => state.user.user,
  groups: state => state.user.groups,
  // course array
  courses: state => state.course.course_list,
  // for store instance, search course_list for id in param
  course: state => id =>
    state.course.course_list.find(course => String(course.id) === String(id)),
  // for import table
  importTable: state => state.table.importTable
}
export default getters
