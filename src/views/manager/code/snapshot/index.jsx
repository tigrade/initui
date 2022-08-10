import React,{DSBase,DSTable,DSComponent,Fragment,post,Link} from 'comp/index';

import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined } from '@ant-design/icons';
import CodeSnapshotFormView from 'views/manager/code/snapshot/form';

class CodeSnapshotView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        const {id} = props.location.state;
        this.state = {searchCondition:{...props.searchCondition,codeExtensionId:id}};
        
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
        const {id} = this.props.location.state;
        this.setState(state=>{
            state.searchCondition = {...searchCondition,codeExtensionId:id};
            return state;
        },()=>{
            this.searchFormRef.current.resetFields();//重置搜索
            this.tableRef.current.reload();//刷新表单
        });
    }
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/code/snapshot/delete",params).catch(error => {
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
        const {id} = this.props.location.state;
        const {searchCondition} = this.state;
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '编码',dataIndex: 'code'},
        {title: '快照',dataIndex: 'snapshot'},
        
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
            <CodeSnapshotFormView ref={this.formRef} codeExtensionId={id} reloadTable={this.onReload}></CodeSnapshotFormView>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    
                    <Breadcrumb.Item key={DSBase.list.S_CodeExtensionView.path}><Link to={DSBase.list.S_CodeExtensionView.path}><span>编码扩展管理</span></Link></Breadcrumb.Item>
                    <Breadcrumb.Item>【{this.props.location.state.name}】编码快照管理</Breadcrumb.Item>
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
                            <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor.bind(this,undefined)}>新增</Button>
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={searchCondition} path={'/api/code/snapshot/list'} pageable={false} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default CodeSnapshotView;