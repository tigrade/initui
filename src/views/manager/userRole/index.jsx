import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';

import UserRoleFormView from 'views/manager/userRole/form';
class UserRoleView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        this.state = {searchCondition:props.searchCondition};
    }
    static defaultProps = {
        searchCondition:{}
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
        const response = await post("/api/role/delete",params).catch(error => {
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
        const {searchCondition} = this.state;
        const columns=[
            {title: '昵称',dataIndex: 'aliasName'},
            {title: '账号',dataIndex: 'account'},
            {title: '邮箱',dataIndex: 'email'},
            {title: '手机',dataIndex: 'phone'},
            {title: '状态',dataIndex: 'status'},
            {title: '最后一次登录',dataIndex: 'lastLoginIp'},
            {title: '操作',width:160,render:(value,item,index)=>{
                return (
                <Space>
                    <Button type="link" onClick={this.onEditor.bind(this,item)}>授权</Button>
                </Space>
                );
            }}];
        return (
        <Fragment>
            <UserRoleFormView ref={this.formRef} reloadTable={this.onReload}></UserRoleFormView>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>用户授权</Breadcrumb.Item>
                </Breadcrumb>
                <div className='ds-search'>
                    <div className='ds-search-title'>
                        <Row wrap={false}>
                            <Col flex="auto">数据筛选</Col>
                            {/* <Col flex="100px" style={{textAlign:'right'}}>高级搜索</Col> */}
                        </Row>
                    </div>
                    <div className='ds-search-wrap'>
                        <Form layout="inline" ref={this.searchFormRef} initialValues={searchCondition} onFinish={this.onSearch}>
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
                            {/* <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor}>新增</Button> */}
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={searchCondition} path={'/api/user/find'} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default UserRoleView;