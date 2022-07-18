// 导出view模块
export { default as DefaultView }  from 'views/default/index';
export { default as LoginView }  from 'views/login/index';

export { default as CaseView }  from 'views/case/index';
export { default as NewCaseView }  from 'views/case/new/index';


//配置视图
const _init = {
    root:{path:"/"},//登出路径
    login:{path:"/login"},//登录路径
    logout:{path:"/logout"},//登出路径

    list:{
        _LoginView:{path:"/login",code:"LoginView",desc:"登录、注册、忘记密码页面",only:true},//only:true  独立页面不包含在框架内

        _DefaultView:{path:"/",code:"DefaultView",desc:"默认页面",only:false},

        _CaseView:{path:"/case",code:"CaseView",desc:"案件管理页面",only:false},
        _NewCaseView:{path:"/case/new",code:"NewCaseView",desc:"新增案件页面",only:false},//only:false  独立页面包含在框架内
    },

    //菜单可以服务器传递过来
    menus:[
    {path:"/",name:"首页",key:1},
    {path:"/case",name:"案件",key:2},
    {path:"/task",name:"任务",key:3},
    {path:"/client",name:"客户",key:4},
    {path:"/client",name:"客户22",key:5},
    {path:"/client",name:"客x",key:6},
    ]
};

export default _init;