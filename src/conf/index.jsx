//配置视图
const DSBase = {
    root:{path:"/"},//登出路径
    login:{path:"/login"},//登录路径
    logout:{path:"/logout"},//登出路径

    list:{
        _LoginView:{path:"/login",code:"LoginView",desc:"登录、注册、忘记密码页面",only:true},//only:true  独立页面不包含在框架内
        P_DefaultView:{path:"/",code:"P_DefaultView",desc:"默认页面",only:false},
        P_CaseView:{path:"/case",code:"P_CaseView",desc:"案件管理页面",only:false},
        P_NewCaseView:{path:"/case/new",code:"P_NewCaseView",desc:"新增案件页面",only:false},//only:false  独立页面包含在框架内



        //system
        S_DefaultView:{path:"/content/home",code:"S_DefaultView",desc:"后台主页",only:false},
        S_ModuleView:{path:"/content/moduleMgmt",code:"S_ModuleView",desc:"模块管理",only:false},
        S_UserRoleView:{path:"/content/userRoleMgmt",code:"S_UserRoleView",desc:"用户授权",only:false},
        S_RoleResourceView:{path:"/content/roleResourceMgmt",code:"S_RoleResourceView",desc:"角色授权",only:false},
        S_ResourceView:{path:"/content/resourceMgmt",code:"S_ResourceView",desc:"资源管理",only:false},
        S_RoleView:{path:"/content/roleMgmt",code:"S_RoleView",desc:"角色管理",only:false},
        S_UserView:{path:"/content/userMgmt",code:"S_UserView",desc:"用户管理",only:false},

    },

    //菜单可以服务器传递过来
    menus:[
    {path:"/",name:"首页",code:1},
    {path:"/case",name:"案件",code:2},
    {path:"/task",name:"任务",code:3},
    {path:"/client",name:"客户",code:4},
    {path:"/client",name:"计划",code:5},
    {path:"/client",name:"宝典",code:6}
    ]
};

export default DSBase;