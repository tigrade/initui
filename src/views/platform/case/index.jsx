import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input, Button,Row,Col,Breadcrumb,message,Space,Select,DatePicker} from 'antd';
import {PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

import CaseFormView from 'views/platform/case/form';

class CaseView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tableRef = React.createRef();
        this.searchFormRef = React.createRef();
        const {teamView} = this.props.context;
        this.state = {searchCondition:props.searchCondition,teamView:teamView,caseTypeList:[]};
    }
    static defaultProps = {
        searchCondition:{}
    }
    componentDidMount=async ()=>{
        const {teamView} = this.props.context;
        await this.loadCaseTypeList(teamView.id);
    }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    loadCaseTypeList = async(teamId)=>{
        const params = new FormData();
        params.append("teamId", teamId);
        const response = await post('/api/caseType/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.caseTypeList = results;
                return state;
            });
        }
    }
    onSearch=async(e)=>{
        const {searchTime,title,status,caseTypeId} = e;
        let condition = {};
        if(searchTime){
            const createTimeStart = moment(searchTime[0]).format("YYYY-MM-DD 00:00:01");
            const createTimeEnd = moment(searchTime[1]).format("YYYY-MM-DD 00:00:01");
            condition = Object.assign({},condition,{createTimeStart:createTimeStart,createTimeEnd:createTimeEnd});
        }
        if(title){
            condition = Object.assign({},condition,{title:title});
        }
        if(status){
            condition = Object.assign({},condition,{status:status});
        }
        if(caseTypeId){
            condition = Object.assign({},condition,{caseTypeId:caseTypeId});
        }
        
        this.setState(state=>{
            state.searchCondition = condition;
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
        const {searchCondition,teamView,caseTypeList} = this.state;
        if(teamView===undefined||(teamView!==undefined&&teamView.id===undefined)){
            return;
        }
        const condition = Object.assign(searchCondition,{teamId:teamView.id})
        const columns=[
        {title: '名称',render:(value,item,index)=>{
            return `【${item['caseTypeName']}】 ${item['title']}`;
        },fixed: 'left',width:250,ellipsis: true},
        {title: '程序',dataIndex: 'lastLawCaseItemName',width:80},
        // {title: '进度',dataIndex: 'code',width:80},
        // {title: '任务',dataIndex: 'level',width:80},
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
                            <Row gutter={[8,16]}>
                                <Col>
                                <Form.Item name="caseTypeId" label="案件类型">
                                    <Select style={{width:"120px"}}>
                                        {caseTypeList.map(e=>{
                                                return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                                            })}
                                    </Select>
                                </Form.Item>
                                </Col>
                                <Col>
                                <Form.Item name="title" label="名称">
                                    <Input placeholder="" autoComplete="off"/>
                                </Form.Item>
                                </Col>
                                <Col>
                                <Form.Item name="searchTime" label="建档">
                                    <DatePicker.RangePicker />
                                </Form.Item>
                                </Col>
                                <Col>
                                <Form.Item name="status" label="状态">
                                    <Select style={{width:"120px"}}>
                                        <Select.Option value="processing">处理中</Select.Option>
                                        <Select.Option value="closed">结案</Select.Option>
                                    </Select>
                                </Form.Item>
                                </Col>
                                <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">搜索</Button>
                                </Form.Item>
                                </Col>
                                <Col>
                                <Form.Item>
                                    <Button onClick = {this.onReset}>重置</Button>
                                </Form.Item>
                                </Col>
                            </Row>
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