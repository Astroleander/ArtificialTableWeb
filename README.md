# MarkSystemWeb
V_1.0.1版本：
修改时间：2019/09/30 
前端：
1、router/index.js
讲班级学生管理路由放置到form.vue中转变成动态路由，此时前端服务器加载需要10s，页面组件加载需要6s，需要提升服务器性能
后端：
2、LessonView.py
增加课程的时候，增加初始大项['平时', '出勤', '期中', '期末', '加分']
3、TitleView.py
小项权重改为占比=100/n ,n为该大项对应有n个小项

V_1.0.1版本：
修改日期 2019/10/14
后端：
1、LessonView.py
增加课程的时候，增加初始大项['平时', '出勤', '期中', '期末', '加分'],加分和出勤初始权重为0，平时',期中, 期末，初始权重分别是33.33
小项权重改为占比=100/n ,n为该大项对应有n个小项
前端：
2、修改关于首页引导组件鼠标焦点汇聚变成小手。
3、修改班级为：教学班级  修改课程：课程组。 注意：管理员界面存在诸多bug，现阶段从普通教师界面着手。

V_1.0.2版本：
修改日期 2019/10/14
后端：
1、更改table/class_info/format_get接口，增加课程人数属性
前端：
1、添加班级缺省
2、个人信息更改
3、班级添加学生界面简化成一个界面
4、修改关于总分计算问题

V_1.0.3版本：
修改日期 2019/10/17
后端
1、更改table/class_info/format_get接口，增加课程人数属性
2、更改title/format_post接口，添加小项的时候，判断其归属大项设置默认初始值
前端
1、班级添加学生省略入学学年、增设导入加载loading、成绩管理可以省略弹出框添加成绩。

V_1.0.4版本：
修改日期 2019/10/21
前端：
1、美化登陆界面。

V_1.0.5版本：
修改日期 2019/10/22
前端：
1、菜单路由动态加载。
2、存在问题：角色转换的问题.
3、登陆图片消耗了9s
4、0.js的大小没有减小。

V_1.0.6版本：
修改日期 2019/10/23
1、暂时完成动态路由加载，但是发现打包后的包大小并未减小，优化有待进一步优化。
2、登陆界面添加图片过于加载缓慢，需要学习CDN加载图片。

V_1.0.7版本：
修改日期 2019/11/04
现阶段普通教师的功能中
1、完成了成绩分析界面的重构，但接口尚未写出
2、导入成绩界面修改完成
3、成绩界面的加载还需要优化
4、课程分析界面尚在重构阶段
5、教研室主任的功能需要重新设计，尤其是成绩比较界面的重构

V_1.0.8版本：
修改日期 2019/11/13
现阶段普通教师的功能部分
1、除了课程分析外已全部修复完善
2、成绩比较、课程分析、成绩预测正在重做
3、导入成绩最后的错误处理还需要加强

V_1.0.9版本：
修改日期 2019/11/14
现阶段普通教师的功能部分
1、已全部修复一遍，现可以发布
2、暂时屏蔽课程分析界面

V_1.0.10版本：
修改日期 2019/12/09
1、现阶段除了成绩分析与班级成绩比较，所有功能已完成，但课程分析暂时屏蔽。
2、老师想要把小项测试的成绩权重加回来，还没做。
3、需要完成下一阶段的测试工作。

V_1.0.11版本：
修改日期 2019/12/31
1、现阶段可发布，但是成绩分析少了两张分析图
2、导出成绩、成绩分析还存在延迟
3、导入学生现阶段不可覆盖

V_1.0.12版本：
修改日期 2020/1/1
1、所有更新已恢复
2、程远恒的成绩比较暂时可用
3、导出成绩有bug，关于无效成绩影响导出

V_1.0.13版本：
修改日期 2020/4/5
1、所有更新已恢复
2、程远恒的成绩分析已加入
3、导出成绩bug已完成
4、需要进一步测试
5、导出固定成绩模版尚未完成




