import React,{DSBase,DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space} from 'antd';
import {PlusOutlined } from '@ant-design/icons';

import CaseFormView from 'views/platform/case/form';

class CaseView extends DSComponent{   
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
            const {teamView} = state;
            state.searchCondition = Object.assign(searchCondition,{teamId:teamView.id});
            return state;
        },()=>{
            this.searchFormRef.current.resetFields();//重置搜索
            this.tableRef.current.reload();//刷新表单
        });
    }
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/lawCase/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
    }
    onEditor=()=>{
        const {teamView} = this.state;
        this.formRef.current.onEditor(teamView);
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    
    render(){
        const {searchCondition,teamView} = this.state;
        if(teamView===undefined||(teamView!==undefined&&teamView.id===undefined)){
            return;
        }
        const condition = Object.assign(searchCondition,{teamId:teamView.id})
        const columns=[
        {title: '名称',render:(value,item,index)=>{
            return `【${item['caseTypeName']}】 ${item['title']}`;
        },fixed: 'left',width:250,ellipsis: true},
        {title: '程序',dataIndex: 'code',width:80},
        {title: '进度',dataIndex: 'code',width:80},
        {title: '任务',dataIndex: 'level',width:80},
        {title: '状态',dataIndex: 'status',width:50,render:(value,item,index)=>{
            if(value==="processing")return "处理中";
            if(value==="closed")return "结案";
            return value;
        }},
        {title: '建档',dataIndex: 'createTime',width:100},
        {title: '操作',width:100,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="link" onClick={()=>{
                    window.open(`/content/lawCase/detail?id=${item.id}`, '_blank');
                }}>详情</Button>
                <Button type="link" onClick={this.onDelete.bind(this,item)}>删除</Button>
            </Space>
            );
        },fixed: 'right'}];
        return (
        <Fragment>
            <CaseFormView ref={this.formRef} reloadTable={this.onReload} {...{navigate:this.props.navigate}}></CaseFormView>
            <div className='ds-back-layout'>
                <Breadcrumb className='ds-crumb'>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>案件管理</Breadcrumb.Item>
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
                            <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor.bind(this)}>新增</Button>
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={condition} path={'/api/lawCase/find'} ref={this.tableRef} other={{scroll:{ x: 1500 } }}></DSTable>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default CaseView;