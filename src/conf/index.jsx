//配置视图
const DSBase = {
    root:{path:"/"},//登出路径
    login:{path:"/login"},//登录路径
    logout:{path:"/logout"},//登出路径

    list:{
        _LoginView:{path:"/login",code:"LoginView",desc:"登录、注册、忘记密码页面",only:true},//only:true  独立页面不包含在框架内
        P_InviteView:{path:"/content/invite",code:"P_InviteView",desc:"成员邀请",only:true},//邀请页面
        P_DefaultView:{path:"/content/index",code:"P_DefaultView",desc:"默认页面",only:false},
        P_StoreView:{path:"/content/storeMgmt",code:"P_StoreView",desc:"存储管理",only:false},
        P_TeamplateView:{path:"/content/templateMgmt",code:"P_TeamplateView",desc:"模板管理",only:false},
        P_TeamCustomerView:{path:"/content/teamCustomerMgmt",code:"P_TeamCustomerView",desc:"客户管理",only:false},
        P_CaseView:{path:"/content/caseMgmt",code:"P_CaseView",desc:"案件管理",only:false},
        P_TaskView:{path:"/content/caseTaskMgmt",code:"P_TaskView",desc:"案件任务管理",only:false},
        P_CaseDetailView:{path:"/content/lawCase/detail",code:"P_CaseDetailView",desc:"案件详情",only:true},//only:false  独立页面包含在框架内
        P_TeamSettingView:{path:"/content/teamSettingMgmt",code:"P_TeamSettingView",desc:"团队设置",only:false},//only:false  独立页面包含在框架内
        P_TeamView:{path:"/content/teamMgmt",code:"P_TeamView",desc:"团队管理",only:false},//only:false  独立页面包含在框架内
        P_TeamUserJoinView:{path:"/content/teamUserJoinMgmt",code:"P_TeamUserJoinView",desc:"申请加入团队",only:false},//only:false  独立页面包含在框架内
        
        P_ShareCaseDetailView:{path:"/content/share/lawCase/index",code:"P_ShareCaseDetailView",desc:"案件详情",only:true},//only:false  独立页面包含在框架内
        

        P_TreasuredBookView:{path:"/content/treasuredBookMgmt",code:"P_TreasuredBookView",desc:"宝典管理",only:false},//only:false  独立页面包含在框架内
        P_BriefTopicView:{path:"/content/briefTopic/detail",code:"P_BriefTopicView",desc:"专题详情",only:true},//only:false  独立页面包含在框架内
        P_CaseSearchView:{path:"/content/caseSearch",code:"P_CaseSearchView",desc:"案件全局搜索",only:true},

        


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

        S_SecurityView:{path:"/content/securityMgmt",code:"S_SecurityView",desc:"安全管理",only:false},

        
        

    },

    //菜单可以服务器传递过来
    menus:[
    // {path:"/",name:"首页",code:1},
    // {path:"/case",name:"案件",code:2},
    // {path:"/task",name:"任务",code:3},
    // {path:"/client",name:"客户",code:4},
    // {path:"/client",name:"计划",code:5},
    // {path:"/client",name:"宝典",code:6}
    ],
    lawCaseMenus:[
        {name:"基本信息",code:"BASE_INFO"},
        {name:"程序列表",code:"CASE_ITEM"},
        {name:"流程节点",code:"CASE_PROCESS"},
        {name:"成员列表",code:"CASE_MEMBER"},
        {name:"存储列表",code:"CASE_FILES"},
    ]
};

export default DSBase;