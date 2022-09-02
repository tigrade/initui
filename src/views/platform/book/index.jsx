import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined,SettingOutlined } from '@ant-design/icons';

import BriefTreeView  from 'views/platform/book/brief';
import BriefFormView from 'views/platform/book/briefForm';
import TopicFormView from 'views/platform/book/topicFormww';


class TreasuredBookView extends DSComponent{   
    constructor(props){
        super(props);
        this.briefFormRef = React.createRef();
        this.topicFormRef = React.createRef();
        
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        this.briefTreeRef = React.createRef();
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
            this.briefTreeRef.current.unSelect();
        });
    }
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/module/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onEditor=(type,item)=>{
        if(type==="briefSetting"){
            this.briefFormRef.current.onEditor(item);
        }
        if(type==="topciNew"){
            this.topicFormRef.current.onEditor(item);
        }
        if(type==="topicModify"){
            this.topicFormRef.current.onEditor(item);
        }
        if(type==="briefTopicDetail"){
            window.open(`/content/briefTopic/detail?id=${item.id}`, '_blank');
        }
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    onSelectNode=(node)=>{
        this.setState(state=>{
            state.searchCondition = Object.assign({},state.searchCondition,{moduleId:node[0]});
            return state;
        },()=>{
            this.onReload();
        });
    }

    render(){
        const {searchCondition} = this.state;
        const columns=[
        {title: '专题描述',dataIndex: 'title'},
        {title: '概述',dataIndex: 'content'},
        {title: '分类',dataIndex: 'briefName'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="link" onClick={this.onEditor.bind(this,"briefTopicDetail",item)}>详情</Button>
                <Button type="link" onClick={this.onDelete.bind(this,item)}>删除</Button>
            </Space>
            );
        }}];

        return (
        <Fragment>
            <BriefFormView  ref={this.briefFormRef} reloadTable={this.onReload}></BriefFormView>
            <TopicFormView  ref={this.topicFormRef} reloadTable={this.onReload}></TopicFormView>
            
            <div className='fl-book'>
                <Breadcrumb className='fl-book-crumb'>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>宝典管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='fl-book-search'>
                    <div className='fl-book-search-title'>
                        <Row wrap={false}>
                            <Col flex="auto">数据筛选</Col>
                        </Row>
                    </div>
                    <div className='fl-book-search-wrap'>
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
                <div className='fl-book-wrap'>
                <Row wrap={false}>
                    <Col flex="250px">
                    <div className='fl-book-classify'>
                        <div className='fl-book-classify-title'>
                        <Row wrap={false} align="middle">
                            <Col flex="auto">案由分类</Col>
                            <Col flex="100px" style={{textAlign:'right'}}>
                                <Button type="link" icon={<SettingOutlined />}  onClick={this.onEditor.bind(this,"briefSetting")}>设置</Button>
                            </Col>
                        </Row>
                        </div>
                        <div className='fl-book-classify-wrap' style={{borderTop:"1px solid #f0f0f0"}}>
                        <Row>
                            <Col flex="250px">
                                <div style={{marginTop:12}}>
                                <BriefTreeView onSelect={this.onSelectNode} ref={this.briefTreeRef}></BriefTreeView>
                                </div>
                            </Col>
                        </Row>
                        </div>
                    </div>
                    </Col>

                    <Col flex="auto">
                    <div className='fl-book-question'>
                        <div className='fl-table-title'>
                        <Row wrap={false} align="middle">
                            <Col flex="auto">专题列表</Col>
                            <Col flex="100px" style={{textAlign:'right'}}>
                                <Button type="primary" icon={<PlusOutlined/>}  onClick={this.onEditor.bind(this,"topciNew")}>新增</Button>
                            </Col>
                        </Row>
                        </div>
                        <div className='fl-table-wrap' style={{borderTop:"1px solid #f0f0f0"}}>
                        <Row>
                            <Col flex="auto">
                                <DSTable columns={columns} searchCondition={searchCondition} path={'/api/briefTopic/find'} ref={this.tableRef}></DSTable>
                            </Col>
                        </Row>
                        </div>
                    </div>
                    </Col>
                </Row>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default TreasuredBookView;