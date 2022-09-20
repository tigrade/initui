import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined } from '@ant-design/icons';
class P_TeamUserJoinView extends DSComponent{
    constructor(props){
        super(props);
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        const {teamView} = this.props.context;
        this.formRef = React.createRef();
        this.state = {teamView:teamView,searchCondition:props.searchCondition};
    }
    static defaultProps = {
        searchCondition:{}
    }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    onSearch=async(e)=>{
        this.setState(state=>{
            state.searchCondition = e;
            return state;
        },()=>{
            this.tableRef.current.reload();//刷新表单
        });
    }
    onReset=()=>{
        const {searchCondition} = this.props;
        this.setState(state=>{
            state.searchCondition = searchCondition;
            return state;
        },()=>{
            this.searchFormRef.current.resetFields();//重置搜索
            this.tableRef.current.reload();//刷新表单
        });
    }
    onApproval=async(id,status)=>{
        const params = new FormData();
        params.append("id", id);
        params.append("status", status);
        const response = await post("/api/team/user/join/approval",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    render(){
        const {searchCondition,teamView} = this.state;
        if(teamView===undefined||(teamView!==undefined&&teamView.id===undefined)){
            return;
        }
        const condition = Object.assign({},searchCondition,{teamId:teamView.id});
        const columns=[
        {title: '申请用户',dataIndex: 'userName'},
        {title: '邀请用户',dataIndex: 'inviteMemberName'},
        {title: '加入原因',dataIndex: 'content'},
        {title: '参与案件',dataIndex: 'lawCaseList',ellipsis: true},
        {title: '状态',dataIndex: 'status',render:(value,item,index)=>{
            if(value==="APPLY")return "审批";
            if(value==="AGREE")return "同意";
            if(value==="REJECT")return "拒绝";
            return value;
        }},
        {title: '操作',width:160,render:(value,item,index)=>{
            if(item['status']==="APPLY"){
                return (
                    <Space>
                        <Button type="link" onClick={this.onApproval.bind(this,item.id,"AGREE")}>同意</Button>
                        <Button type="link" onClick={this.onApproval.bind(this,item.id,"REJECT")}>拒绝</Button>
                    </Space>
                    );
            }else{
                return (<Space></Space>);
            }
        }}];
        
        return (
        <Fragment>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>团队管理</Breadcrumb.Item>
                    <Breadcrumb.Item>申请加入管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='ds-search'>
                    <div className='ds-search-title'>
                        <Row wrap={false}>
                            <Col flex="auto">数据筛选</Col>
                        </Row>
                    </div>
                    <div className='ds-search-wrap'>
                        <Form layout="inline" ref={this.searchFormRef} initialValues={condition} onFinish={this.onSearch}>
                            <Form.Item name="name" label="名称">
                                <Input placeholder="" autoComplete="off"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">搜索</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick = {this.onReset}>重置</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <div className='ds-table'>
                    <div className='ds-table-title'>
                    <Row wrap={false}>
                        <Col flex="auto">数据列表</Col>
                        <Col flex="100px" style={{textAlign:'right'}}>
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={condition} path={'/api/team/user/join/find'} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default P_TeamUserJoinView;