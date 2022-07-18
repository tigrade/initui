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

    menus:[
    {path:"/",name:"首页"},
    {path:"/case",name:"案件"},
    {path:"/task",name:"任务"},
    {path:"/client",name:"客户"},
    {path:"/client",name:"客户22"},
    {path:"/client",name:"客x"},
    ]
};

export default _init;