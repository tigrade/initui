//配置视图
const DSBase = {
    root:{path:"/"},//登出路径
    login:{path:"/login"},//登录路径
    logout:{path:"/logout"},//登出路径

    list:{
        _LoginView:{path:"/login",code:"LoginView",desc:"登录、注册、忘记密码页面",only:true},//only:true  独立页面不包含在框架内

        P_DefaultView:{path:"/",code:"P_DefaultView",desc:"默认页面",only:false},
        P_StoreView:{path:"/content/storeMgmt",code:"P_StoreView",desc:"存储管理",only:false},
        P_InviteView:{path:"/content/inviteMgmt",code:"P_InviteView",desc:"成员邀请",only:false},
        P_TeamplateView:{path:"/content/templateMgmt",code:"P_TeamplateView",desc:"模板管理",only:false},
        P_CaseView:{path:"/content/caseMgmt",code:"P_CaseView",desc:"案件管理",only:false},
        P_TaskView:{path:"/content/taskMgmt",code:"P_TaskView",desc:"任务管理",only:false},
        P_CaseNewView:{path:"/content/caseNew",code:"P_CaseNewView",desc:"新增案件",only:false},//only:false  独立页面包含在框架内
        P_TeamSettingView:{path:"/content/teamSettingMgmt",code:"P_TeamSettingView",desc:"团队设置",only:false},//only:false  独立页面包含在框架内
        P_TeamView:{path:"/content/teamMgmt",code:"P_TeamView",desc:"团队管理",only:false},//only:false  独立页面包含在框架内
        P_TreasuredBookView:{path:"/content/treasuredBookMgmt",code:"P_TreasuredBookView",desc:"宝典管理",only:false},//only:false  独立页面包含在框架内
        P_CaseSearchView:{path:"/content/caseSearch",code:"P_CaseSearchView",desc:"案件搜索",only:true},//only:false  独立页面包含在框架内
        


        //system
        S_DefaultView:{path:"/content/home",code:"S_DefaultView",desc:"后台主页",only:false},
        S_ModuleView:{path:"/content/moduleMgmt",code:"S_ModuleView",desc:"模块管理",only:false},
        S_UserRoleView:{path:"/content/userRoleMgmt",code:"S_UserRoleView",desc:"用户授权",only:false},
        S_RoleResourceView:{path:"/content/roleResourceMgmt",code:"S_RoleResourceView",desc:"角色授权",only:false},
        S_ResourceView:{path:"/content/resourceMgmt",code:"S_ResourceView",desc:"资源管理",only:false},
        S_RoleView:{path:"/content/roleMgmt",code:"S_RoleView",desc:"角色管理",only:false},
        S_UserView:{path:"/content/userMgmt",code:"S_UserView",desc:"用户管理",only:false},

        S_CustomerView:{path:"/content/clientMgmt",code:"S_CustomerView",desc:"客户管理",only:false},
        S_MerchantView:{path:"/content/merchantMgmt",code:"S_MerchantView",desc:"商户管理",only:false},
        S_MerchantRoleView:{path:"/content/merchantRoleMgmt",code:"S_MerchantRoleView",desc:"商户角色管理",only:false},
        S_MerchantTypeView:{path:"/content/merchantTypeMgmt",code:"S_MerchantTypeView",desc:"商户类型管理",only:false},
        S_MerchantUserView:{path:"/content/userMgmt",code:"S_MerchantUserView",desc:"商户用户管理",only:false},
        S_IPWhiteListView:{path:"/content/whitelistMgmt",code:"S_IPWhiteListView",desc:"商户访问管理",only:false},

        S_CodeExtensionView:{path:"/content/codeExtensionMgmt",code:"S_CodeExtensionView",desc:"编码扩展管理",only:false},
        S_CodeSourceView:{path:"/content/codeSourceMgmt",code:"S_CodeSourceView",desc:"编码來源管理",only:false},
        S_CodeTypeView:{path:"/content/codeTypeMgmt",code:"S_CodeTypeView",desc:"编码类型管理",only:false},
        S_CodeAttributeView:{path:"/content/codeAttributeMgmt",code:"S_CodeAttributeView",desc:"编码属性管理",only:false},
        S_CodeSnapshotView:{path:"/content/codeSnapshotMgmt",code:"S_CodeSnapshotView",desc:"编码快照管理",only:false},
        

    },

    //菜单可以服务器传递过来
    menus:[
    // {path:"/",name:"首页",code:1},
    // {path:"/case",name:"案件",code:2},
    // {path:"/task",name:"任务",code:3},
    // {path:"/client",name:"客户",code:4},
    // {path:"/client",name:"计划",code:5},
    // {path:"/client",name:"宝典",code:6}
    ]
};

export default DSBase;