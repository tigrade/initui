import React,{DSBase,DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined } from '@ant-design/icons';

class StoreView extends DSComponent{   
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
    componentDidMount=()=>{
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
        const response = await post("/api/customer/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onEditor=(item,type)=>{
        if(type===2){
            this.props.navigate(DSBase.list.S_CodeAttributeView.path, { replace: true,state:{id:item.id,name:item.name}});
        }
        if(type===3){
            this.props.navigate(DSBase.list.S_CodeSnapshotView.path, { replace: true,state:{id:item.id,name:item.name}});
        }
        if(type===1){
            this.formRef.current.onEditor(item);
        }
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    
    render(){
        const {searchCondition} = this.state;
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '案件',dataIndex: 'code'},
        {title: '上传者',dataIndex: 'code'},
        {title: '建档',dataIndex: 'code'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
            </Space>
            );
        }}];
        return (
        <Fragment>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>存储管理</Breadcrumb.Item>
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
                            {/* <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor.bind(this,undefined)}>新增</Button> */}
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={searchCondition} path={'/api/store/find'} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default StoreView;