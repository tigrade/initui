import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined } from '@ant-design/icons';
import TeamCustomerFormView from 'views/platform/customer/form';
class TeamCustomerView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        const {teamView} = this.props.context;
        this.state = {searchCondition:props.searchCondition,teamView:teamView};
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
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/team/customer/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onEditor=(item)=>{
        this.formRef.current.onEditor(item);
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    render(){
        const {searchCondition,teamView} = this.state;
        const _searchCondition = Object.assign({},searchCondition,{teamId:teamView.id});
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="link" onClick={this.onEditor.bind(this,item)}>编辑</Button>
                <Button type="link" onClick={this.onDelete.bind(this,item)}>删除</Button>
            </Space>
            );
        }}];
        
        return (
        <Fragment>
            <TeamCustomerFormView teamView={teamView} ref={this.formRef} reloadTable={this.onReload}></TeamCustomerFormView>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>客户管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='ds-search'>
                    <div className='ds-search-title'>
                        <Row wrap={false}>
                            <Col flex="auto">数据筛选</Col>
                            {/* <Col flex="100px" style={{textAlign:'right'}}>高级搜索</Col> */}
                        </Row>
                    </div>
                    <div className='ds-search-wrap'>
                        <Form layout="inline" ref={this.searchFormRef} initialValues={_searchCondition} onFinish={this.onSearch}>
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
                            <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor.bind(this,undefined)}>新增</Button>
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={_searchCondition} path={'/api/team/customer/find'} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default TeamCustomerView;