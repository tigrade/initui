import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined,SettingOutlined } from '@ant-design/icons';

import CaseTypeTreeView  from 'views/platform/template/caseType';
import CaseTypeFormView from 'views/platform/template/caseTypeForm';
import CaseFieldFormView from 'views/platform/template/caseFieldForm';

import CaseFieldGroupListView  from 'views/platform/template/caseFieldGroup';
import CaseFieldGroupFormView from 'views/platform/template/caseFieldGroupForm';



class TemplateView extends DSComponent{   
    constructor(props){
        super(props);
        this.casetypeFormRef = React.createRef();
        this.casetFieldFormRef = React.createRef();

        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        this.casetypeTreeRef = React.createRef();

        this.casetFieldGroupFormRef = React.createRef();
        this.casetFieldGroupListRef = React.createRef();
        
        const {teamView} = this.props.context;
        this.state = {searchCondition:props.searchCondition,teamView:teamView,caseTypeSelect:false,caseType:{},caseFieldGroup:{}};
    }
    static defaultProps = {
        searchCondition:{caseTypeId:''}
    }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    onReset=()=>{
        const {searchCondition} = this.props;
        this.setState(state=>{
            state.searchCondition = searchCondition;
            return state;
        },()=>{
            this.searchFormRef.current.resetFields();//重置搜索
            this.tableRef.current.reload();//刷新表单
            this.casetypeTreeRef.current.unSelect();
        });
    }
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/caseField/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onEditor=(type,item)=>{
        if(type==="caseTypeSetting"){
            this.casetypeFormRef.current.onEditor();
        }
        if(type==="caseFieldNew"){
            const {caseType} = this.state;
            this.casetFieldFormRef.current.onEditor(caseType,undefined);
        }
        if(type==="caseFieldUpdate"){
            const {caseType} = this.state;
            this.casetFieldFormRef.current.onEditor(caseType,item);
        }
        if(type==="caseFieldGroupSetting"){
            const {caseType} = this.state;
            this.casetFieldGroupFormRef.current.onEditor(caseType);
        }
    }
    onTreeReload=()=>{
        this.casetypeTreeRef.current.reload();
    }
    onListReload=()=>{
        this.casetFieldGroupListRef.current.reload();
    }
    onReload=()=>{
        this.setState(state=>{
            const {searchCondition} = this.props;
            const {caseFieldGroup,caseType} = state;
            let _searchCondition = Object.assign({},searchCondition);;
            if(caseType.id!==undefined){
                _searchCondition = Object.assign({},_searchCondition,{caseTypeId:caseType.id});
            }
            if(caseFieldGroup.id!==undefined){
                _searchCondition = Object.assign({},_searchCondition,{caseFieldGroupId:caseFieldGroup.id});
            }else{

            }
            state.searchCondition = _searchCondition;
            return state;
        },()=>{
            this.tableRef.current.reload();
        });
    }
    onSelectNode=(node)=>{
        this.setState(state=>{
            if(node.selected===true){
                state.caseType = {id:node.node.key,name:node.node.title};
            }else{
                state.caseType = {};
            }
            state.caseTypeSelect = node.selected;
            return state;
        },()=>{
            if(node.selected){
                this.onReload();
                this.onListReload();
            }
        });
    }
    onSelectGroupNode=(node)=>{
        this.setState(state=>{
            if(node.checked===true){
                state.caseFieldGroup = {id:node.id,name:node.name};
            }else{
                state.caseFieldGroup = {};
            }
            return state;
        },()=>{
            this.onReload();
        });
    }


    render(){
        const {searchCondition,teamView,caseType,caseTypeSelect} = this.state;
        if(teamView===undefined||(teamView!==undefined&&teamView.id===undefined)){
            return;
        }
        const teamId = teamView.id;
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '输入类型',dataIndex: 'type',render:(value,item,index)=>{
            if(value==="RADIO")return "单选";
            if(value==="MULTIPLE_CHOICE")return "多选";
            if(value==="TEXT")return "文本";
            if(value==="DATE")return "日期";
            if(value==="DATE_TIME")return "日期时间";
            return value;
        }},
        {title: '输入数据',dataIndex: 'data',render:(e)=>{
            if(e===null){
                return "";
            }
            const dd = e.map(x=>{
                return x.name
            });
            return dd.join(",");
        }},
        {title: '是否必填',dataIndex: 'required',render:(value,item,index)=>{
            if(value===true)return "必填";
            if(value===false)return "选填";
            return value;
        }},
        {title: '排序',dataIndex: 'serialNumber'},
        {title: '分组',dataIndex: 'caseFieldGroupName'},
        {title: '归属',dataIndex: 'caseTypeName'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="link" onClick={this.onEditor.bind(this,"caseFieldUpdate",item)}>编辑</Button>
                <Button type="link" onClick={this.onDelete.bind(this,item)}>删除</Button>
            </Space>
            );
        }}];

        return (
        <Fragment>
            <CaseTypeFormView teamId={teamId}  ref={this.casetypeFormRef} reloadTable={this.onTreeReload}></CaseTypeFormView>
            <CaseFieldFormView caseType={caseType}  ref={this.casetFieldFormRef} reloadTable={this.onReload}></CaseFieldFormView>
            <CaseFieldGroupFormView caseType={caseType}  ref={this.casetFieldGroupFormRef} reloadTable={this.onListReload}></CaseFieldGroupFormView>
            
            <div className='fl-template'>
                <Breadcrumb className='fl-template-crumb'>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>案件模板管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='fl-template-wrap'>
                <Row wrap={false}>
                    <Col flex="250px">
                    <div className='fl-template-classify'>
                        <div className='fl-template-classify-title'>
                        <Row wrap={false} align="middle">
                            <Col flex="auto">案件分类</Col>
                            <Col flex="100px" style={{textAlign:'right'}}>
                                <Button type="link" icon={<SettingOutlined />}  onClick={this.onEditor.bind(this,"caseTypeSetting")}>设置</Button>
                            </Col>
                        </Row>
                        </div>
                        <div className='fl-template-classify-wrap' style={{borderTop:"1px solid #f0f0f0"}}>
                        <Row>
                            <Col flex="250px">
                                <div style={{marginTop:12}}>
                                <CaseTypeTreeView editor={false} teamId={teamId} onSelect={this.onSelectNode} ref={this.casetypeTreeRef}></CaseTypeTreeView>
                                </div>
                            </Col>
                        </Row>
                        </div>
                    </div>
                    </Col>

                    <Col flex="auto">
                    {caseTypeSelect&&
                    <Fragment>
                    <div className='fl-template-group'>
                        <div className='fl-template-group-title'>
                        <Row wrap={false} align="middle">
                            <Col flex="auto">【{caseType.name}】字段分组</Col>
                            <Col flex="100px" style={{textAlign:'right'}}>
                                <Button type="link" icon={<SettingOutlined />}  onClick={this.onEditor.bind(this,"caseFieldGroupSetting")}>设置</Button>
                            </Col>
                        </Row>
                        </div>
                        <div className='fl-template-group-wrap' style={{borderTop:"1px solid #f0f0f0"}}>
                        <Row>
                            <Col flex="auto" style={{paddingBottom:"20px",paddingTop:"12px"}}>
                                <div style={{marginTop:12}}>
                                <CaseFieldGroupListView caseType={caseType} onSelect={this.onSelectGroupNode} ref={this.casetFieldGroupListRef}></CaseFieldGroupListView>
                                </div>
                            </Col>
                        </Row>
                        </div>
                    </div>
                    {/*字段清单*/}
                    <div className='fl-template-question'>
                        <div className='fl-table-title'>
                        <Row wrap={false} align="middle">
                            <Col flex="auto">【{caseType.name}】字段清单</Col>
                            <Col flex="100px" style={{textAlign:'right'}}>
                                <Button type="primary" icon={<PlusOutlined/>}  onClick={this.onEditor.bind(this,"caseFieldNew",undefined)}>新增</Button>
                            </Col>
                        </Row>
                        </div>
                        <div className='fl-table-wrap' style={{borderTop:"1px solid #f0f0f0"}}>
                        <Row>
                            <Col flex="auto" style={{paddingBottom:"20px",paddingTop:"12px"}}>
                                <DSTable columns={columns} searchCondition={searchCondition} path={'/api/caseField/list'}  pageable={false}  ref={this.tableRef}></DSTable>
                            </Col>
                        </Row>
                        </div>
                    </div>
                    </Fragment>
                    }
                    </Col>
                </Row>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default TemplateView;