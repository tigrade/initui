import React,{DSComponent,post,Fragment} from 'comp/index';

import { Layout,Row, Col,Breadcrumb, Input,Select,Tag,Space,Card, Button,Descriptions, DatePicker,Tooltip,Table,Avatar,Dropdown,Spin,Result} from 'antd';
import { AppstoreOutlined,BarsOutlined,UsergroupAddOutlined,SmileOutlined,ArrowUpOutlined,ArrowDownOutlined,CloseOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import {message} from 'antd';

import './index.less';
import moment from 'moment';

const { Header, Footer, Content} = Layout;

class SearchView extends DSComponent{   
    constructor(props){
        super(props);
        this.domRef = React.createRef();
        this.state = {pageNo:0,results:[],minHeight:200,
            showStyle:"card",
            selectedTeamList:[],selectedCustomerList:[],selectedLawCaseTypeList:[],
            selectedLawCaseStatusList:[],selectedLawCaseItemCaseTypeList:[],
            selectedLawCaseItemStatusList:[],selectedSourceList:[],selectedMasterList:[],createTime:undefined};
    }
    static defaultProps = {
        
    }
    componentDidMount=()=>{
        const url = window.location.href;
        const path = url.replace(window.location.search,'');
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        window.history.pushState('','',path);
        this.setState(state => {
            state.data = data;
            return state;
        },()=>{
            this.loadDataSource();
        });
    }
    loadDataSource=async()=>{
        const {pageNo,data,selectedTeamList,
            selectedCustomerList,selectedLawCaseTypeList,selectedLawCaseStatusList,selectedLawCaseItemCaseTypeList,selectedLawCaseItemStatusList,
            selectedSourceList,selectedMasterList,createTime} = this.state;
        const params = new FormData();
        params.append('pageNo', pageNo);
        params.append('pageSize', 6);
        params.append('content', data===null?"":data);
        if(selectedTeamList.length>0){
            params.append('team', selectedTeamList.join());
        }
        if(selectedCustomerList.length>0){
            params.append('customer', selectedCustomerList.join());
        }
        if(selectedLawCaseTypeList.length>0){
            params.append('lawCaseType', selectedLawCaseTypeList.join());
        }
        if(selectedLawCaseStatusList.length>0){
            params.append('lawCaseStatus', selectedLawCaseStatusList.join());
        }
        if(selectedLawCaseItemCaseTypeList.length>0){
            params.append('lawCaseItemCaseType', selectedLawCaseItemCaseTypeList.join());
        }
        if(selectedLawCaseItemStatusList.length>0){
            params.append('lawCaseItemStatus', selectedLawCaseItemStatusList.join());
        }
        if(selectedSourceList.length>0){
            params.append('source', selectedSourceList.join());
        }
        if(selectedMasterList.length>0){
            params.append('master', selectedMasterList.join());
        }
        if(createTime!==undefined&&Object.keys(createTime).length>0){
            params.append('createTimeList', JSON.stringify(createTime));
        }
        
        const response = await post('/api/lawCase/search', params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const h = this.domRef.current.clientHeight;
            const {results,total,teamList,customerList,lawCaseTypeList,lawCaseStatusList,lawCaseItemCaseTypeList,lawCaseItemStatusList,
                sourceList,masterList,createTime} = response;
            this.setState(state=>{
                state.data = data;
                if(state.pageNo>0){
                    state.results = state.results.concat(results);;
                }else{
                    state.results = results;
                }
                state.minHeight = h-65;
                state.total = total;
                state.teamList = teamList;
                state.customerList = customerList;
                state.lawCaseTypeList = lawCaseTypeList;
                state.lawCaseStatusList = lawCaseStatusList;
                state.lawCaseItemCaseTypeList = lawCaseItemCaseTypeList;
                state.lawCaseItemStatusList = lawCaseItemStatusList;
                state.sourceList = sourceList;
                state.masterList = masterList;
                state.createTime = results.length===0?state.createTime:createTime;
                return state;
            },()=>{
            });
        }
    }
    onSearch=async(e)=>{
        this.setState(state => {
            state.data = e;
            state.pageNo = 0;
            return state;
        },()=>{
            this.loadDataSource();
        });
    }
    onNextLoading=()=>{
        this.setState(state => {
            state.pageNo = state.pageNo+1;
            return state;
        },()=>{
            this.loadDataSource();
        });
    }
    selectedConditions=(item,type,checked)=>{
        this.setState(state => {
            if(type==='team'){
                let _selectedTeamList = state.selectedTeamList;
                if(checked===true){
                    _selectedTeamList.push(item);
                    _selectedTeamList = _selectedTeamList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedTeamList = _selectedTeamList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedTeamList = _selectedTeamList;
            }
            if(type==='customer'){
                let _selectedCustomerList = state.selectedCustomerList;
                if(checked===true){
                    _selectedCustomerList.push(item);
                    _selectedCustomerList = _selectedCustomerList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedCustomerList = _selectedCustomerList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedCustomerList = _selectedCustomerList;
            }
            if(type==='lawCaseType'){
                let _selectedLawCaseTypeList = state.selectedLawCaseTypeList;
                if(checked===true){
                    _selectedLawCaseTypeList.push(item);
                    _selectedLawCaseTypeList = _selectedLawCaseTypeList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedLawCaseTypeList = _selectedLawCaseTypeList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedLawCaseTypeList = _selectedLawCaseTypeList;
            }
            if(type==='lawCaseStatus'){
                let _selectedLawCaseStatusList = state.selectedLawCaseStatusList;
                if(checked===true){
                    _selectedLawCaseStatusList.push(item);
                    _selectedLawCaseStatusList = _selectedLawCaseStatusList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedLawCaseStatusList = _selectedLawCaseStatusList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedLawCaseStatusList = _selectedLawCaseStatusList;
            }
            if(type==='lawCaseItemCaseType'){
                let _selectedLawCaseItemCaseTypeList = state.selectedLawCaseItemCaseTypeList;
                if(checked===true){
                    _selectedLawCaseItemCaseTypeList.push(item);
                    _selectedLawCaseItemCaseTypeList = _selectedLawCaseItemCaseTypeList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedLawCaseItemCaseTypeList = _selectedLawCaseItemCaseTypeList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedLawCaseItemCaseTypeList = _selectedLawCaseItemCaseTypeList;
            }
            if(type==='lawCaseItemStatus'){
                let _selectedLawCaseItemStatusList = state.selectedLawCaseItemStatusList;
                if(checked===true){
                    _selectedLawCaseItemStatusList.push(item);
                    _selectedLawCaseItemStatusList = _selectedLawCaseItemStatusList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedLawCaseItemStatusList = _selectedLawCaseItemStatusList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedLawCaseItemStatusList = _selectedLawCaseItemStatusList;
            }
            if(type==='source'){
                let _selectedSourceList = state.selectedSourceList;
                if(checked===true){
                    _selectedSourceList.push(item);
                    _selectedSourceList = _selectedSourceList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedSourceList = _selectedSourceList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedSourceList = _selectedSourceList;
            }
            if(type==='master'){
                let _selectedMasterList = state.selectedMasterList;
                if(checked===true){
                    _selectedMasterList.push(item);
                    _selectedMasterList = _selectedMasterList.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    _selectedMasterList = _selectedMasterList.filter(e=>{
                        return e!==item;
                    });
                }
                state.selectedMasterList = _selectedMasterList;
            }
            state.pageNo = 0;
            return state;
        },()=>{
            this.loadDataSource();
        });
    }
    onDataChange=(datas)=>{
        this.setState(state=>{
            if(datas!==null){
                const createTimeStart = moment(datas[0]).format("YYYY-MM-DD 00:00:01");
                const createTimeEnd = moment(datas[1]).format("YYYY-MM-DD 00:00:01");
                state.createTime = {min:createTimeStart,max:createTimeEnd};
            }else{
                state.createTime = undefined;
            }
            state.pageNo = 0;
            return state;
        },()=>{
            this.loadDataSource();
        });
    }
        

    hasChecked=(item,type)=>{
        if(type==='team'){
            const {selectedTeamList} = this.state;
            return selectedTeamList.includes(item);
        }
        if(type==='customer'){
            const {selectedCustomerList} = this.state;
            return selectedCustomerList.includes(item);
        }
        if(type==='lawCaseType'){
            const {selectedLawCaseTypeList} = this.state;
            return selectedLawCaseTypeList.includes(item);
        }
        if(type==='lawCaseStatus'){
            const {selectedLawCaseStatusList} = this.state;
            return selectedLawCaseStatusList.includes(item);
        }
        if(type==='lawCaseItemCaseType'){
            const {selectedLawCaseItemCaseTypeList} = this.state;
            return selectedLawCaseItemCaseTypeList.includes(item);
        }
        if(type==='lawCaseItemStatus'){
            const {selectedLawCaseItemStatusList} = this.state;
            return selectedLawCaseItemStatusList.includes(item);
        }
        if(type==='source'){
            const {selectedSourceList} = this.state;
            return selectedSourceList.includes(item);
        }
        if(type==='master'){
            const {selectedMasterList} = this.state;
            return selectedMasterList.includes(item);
        }
    }
    onShowStyle=(type)=>{
        this.setState(state=>{
            state.showStyle = type;
            return state;
        });
    }
    bodyRender=()=>{
        const {showStyle,total,results,minHeight,teamList,customerList,lawCaseTypeList,lawCaseStatusList,lawCaseItemCaseTypeList,
            lawCaseItemStatusList,sourceList,masterList,createTime} = this.state;
        console.log(showStyle);
        const columns=[
            {title: '序号',fixed: 'left',dataIndex: 'seq',width: 70 ,render: (value, item, index) => index + 1},
            {title: '名称',dataIndex:"lawCaseTitle",fixed: 'left',width:250,ellipsis: true},
            {title: '程序',render:(value,item,index)=>{
                return `【${item.lawCaseItemStatus===null?"未建立":item.lawCaseItemStatus}】${item.lawCaseItemTitle===null?"无":item.lawCaseItemTitle}`;
            },fixed: 'left',width:250,ellipsis: true},
            {title: '主办律师',dataIndex:"masterName",ellipsis: true},
            {title: '案源人员',dataIndex:"sourceName",ellipsis: true},
            {title: '案件类型',dataIndex:"lawCaseTypeName",ellipsis: true},
            {title: '团队名称',dataIndex:"teamName",ellipsis: true},
            {title: '创建时间',dataIndex:"createTime",ellipsis: true},
           ];
        
        return <Layout>
        <Header className='ds-theme-header'>
        <Row wrap={false}>
            <Col flex="auto">
                <Row wrap={false}>
                    <Col flex="150px"> 
                    </Col>
                    <Col flex="800px">
                        <div style={{padding:"12px 0px"}}>
                        <Input.Group compact>
                            <Select defaultValue="case" size="large">
                                <Select.Option value="case">案件</Select.Option>
                            </Select>
                            <Input.Search style={{ width: '600px' }} defaultValue = {this.state.data} placeholder="输入查找案件关键字" size="large" onSearch={this.onSearch} enterButton allowClear/>
                        </Input.Group>
                        </div>
                    </Col>
                    <Col flex="auto">
                   
                    </Col>
                </Row>
            </Col>
            <Col flex="50px">
                <Row wrap={false}>
                    <Col style={{padding:"0px 8px"}}>
                        <Tooltip placement="bottom" title={"关闭页面"} color="#1890ff">
                            <Button icon={<CloseOutlined />} onClick={()=>{window.close()}}/>
                        </Tooltip>
                    </Col>
                </Row>
            </Col>
        </Row>
        </Header>
        <Layout>
            <Layout style={{padding:"0px",overflow: "auto"}}>
                <Content style={{"padding": "12px 16px",background:"#f0f2f5",minHeight:minHeight,paddingBottom:80}} className='main-wrapper'>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Card>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        {teamList!==undefined&&teamList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>团队</div></Col>
                            <Col flex="auto">
                                <div>
                                {teamList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'team')} onChange={this.selectedConditions.bind(this,d.id,'team')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {customerList!==undefined&&customerList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>客户</div></Col>
                            <Col flex="auto">
                                <div>
                                {customerList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'customer')} onChange={this.selectedConditions.bind(this,d.id,'customer')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {lawCaseTypeList!==undefined&&lawCaseTypeList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>案件类型</div></Col>
                            <Col flex="auto">
                                <div>
                                {lawCaseTypeList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'lawCaseType')} onChange={this.selectedConditions.bind(this,d.id,'lawCaseType')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {lawCaseStatusList!==undefined&&lawCaseStatusList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>案件状态</div></Col>
                            <Col flex="auto">
                                <div>
                                {lawCaseStatusList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'lawCaseStatus')} onChange={this.selectedConditions.bind(this,d.id,'lawCaseStatus')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {lawCaseItemCaseTypeList!==undefined&&lawCaseItemCaseTypeList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>案件程序</div></Col>
                            <Col flex="auto">
                                <div>
                                {lawCaseItemCaseTypeList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'lawCaseItemCaseType')} onChange={this.selectedConditions.bind(this,d.id,'lawCaseItemCaseType')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {lawCaseItemStatusList!==undefined&&lawCaseItemStatusList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>程序状态</div></Col>
                            <Col flex="auto">
                                <div>
                                {lawCaseItemStatusList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'lawCaseItemStatus')} onChange={this.selectedConditions.bind(this,d.id,'lawCaseItemStatus')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}({d.count})</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {sourceList!==undefined&&sourceList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>案源</div></Col>
                            <Col flex="auto">
                                <div>
                                {sourceList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'source')} onChange={this.selectedConditions.bind(this,d.id,'source')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {masterList!==undefined&&masterList.length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>主办律师</div></Col>
                            <Col flex="auto">
                                <div>
                                {masterList.map(d=>{
                                    return <Tag.CheckableTag checked={this.hasChecked(d.id,'master')} onChange={this.selectedConditions.bind(this,d.id,'master')} color="default" key={d.id} style={{fontSize:12,padding:"4px 12px"}}>{d.name}</Tag.CheckableTag>
                                })}
                                </div>
                            </Col>
                        </Row>
                        }
                        {createTime!==undefined&&createTime&&Object.keys(createTime).length>0&&
                        <Row  wrap={false} style={{borderBottom:"1px solid #f5f5f5"}} gutter={8} align="middle">
                            <Col flex="120px"><div style={{background:"#f0f0f0",padding:"8px 12px",fontSize:14}}>时间范围</div></Col>
                            <Col flex="auto">
                            <DatePicker.RangePicker key={Math.floor(Math.random() * 10000)}
                                        defaultValue={[moment(createTime.min, "YYYY-MM-DD HH:mm:ss"), moment(createTime.max, "YYYY-MM-DD HH:mm:ss")]}
                                        disabled={[false, false]} onChange={this.onDataChange}/>
                            </Col>
                        </Row>
                        }
                    </Space>
                    </Card>
                    {/* } */}
                    
                    {/* {results.length>0&& */}
                    <div>
                        <div style={{padding:"16px 12px",backgroundColor:"#fff",width:"100%",marginBottom:"16px"}}>
                        <Row  wrap={false} gutter={[16,16]} align="middle">
                            <Col flex="220px">
                            <Breadcrumb className='ds-crumb' separator=">">
                                <Breadcrumb.Item>查询结果【{total?total:0}】</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.state.data===""||this.state.data===null?"全部":this.state.data}</Breadcrumb.Item>
                            </Breadcrumb>
                            </Col>
                            <Col flex="auto">
                                
                            </Col>
                            <Col flex="160px">
                                <Row  wrap={false} gutter={4} align="middle">
                                    <Col>
                                    <Tooltip placement="bottom" title={"按时间降序"}>
                                        <Button  icon={<ArrowDownOutlined />}/>
                                    </Tooltip>
                                    </Col>
                                    <Col>
                                    <Tooltip placement="bottom" title={"按时间升序"}>
                                        <Button  icon={<ArrowUpOutlined />}/>
                                    </Tooltip>
                                    </Col>
                                    <Col>
                                    <Tooltip placement="bottom" title={"卡片风格"}>
                                        <Button  icon={<AppstoreOutlined />} onClick={this.onShowStyle.bind(this,"card")}/>
                                    </Tooltip>
                                    </Col>
                                    <Col>
                                    <Tooltip placement="bottom" title={"列表风格"}>
                                        <Button  icon={<BarsOutlined />}  onClick={this.onShowStyle.bind(this,"list")}/>
                                    </Tooltip>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {results.length===0&&
                        <Result
                            icon={<SmileOutlined />}
                            title="未找到相关数据"
                        />
                        }
                        </div>
                        {showStyle==="list"&&
                        <Table columns={columns} dataSource={results} size="middle" pagination={false} 
                            onRow={record=>{
                                return {onClick:event=>{
                                    window.open(`/content/lawCase/detail?id=${record.lawCaseId}`, '_blank');
                                }};
                            }}/>
                        }
                        {showStyle==="card"&&
                        <Row gutter={[32, { xs: 8, sm: 16, md: 24, lg: 32 }]} type="flex">
                        {results.map(d=>{
                            return <Col span={8} key={Math.floor(Math.random() * 10000)}>
                                <Card title={d.customerName} extra={d.lawCaseStatus} hoverable={true} onClick={()=>{window.open(`/content/lawCase/detail?id=${d.lawCaseId}`, '_blank');}}>
                                <Card.Meta
                                    title={`【${d.lawCaseItemStatus===null?"未建立":d.lawCaseItemStatus}】${d.lawCaseItemTitle===null?"无":d.lawCaseItemTitle}`}
                                    description={
                                        <div title={d.lawCaseTitle} style={{textOverflow: "ellipsis",overflow:"hidden",whiteSpace: "nowrap"}}>{d.lawCaseTitle}</div>
                                    }
                                    />
                                <div style={{margin:"12px 0px",padding:"4px"}}>
                                    <Descriptions  bordered title={"案件信息"} column={1} size={"small"}>
                                        <Descriptions.Item  label={"团队名称"}>{d.teamName}</Descriptions.Item>
                                        <Descriptions.Item  label={"案件类型"}>{d.lawCaseTypeName}</Descriptions.Item>
                                        <Descriptions.Item  label={"主办律师"}>{d.masterName}</Descriptions.Item>
                                        <Descriptions.Item  label={"案源人员"}>{d.sourceName}</Descriptions.Item>
                                        <Descriptions.Item  label={"创建时间"}>{d.createTime}</Descriptions.Item>
                                    </Descriptions>
                                </div>
                                </Card>
                            </Col>
                        })}
                        </Row>
                        }
                    </div>
                    {/* } */}
                </Space>
                </Content>
            </Layout>
        </Layout>

        <Footer plain='true'>
            <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                <a href="//beian.miit.gov.cn" target="_blank" rel="noreferrer">闽ICP备18004543号-1</a>
            </div>
        </Footer>
    </Layout>;
    }
    render(){
        if(this.state.data===undefined)return ;
        const {results,total} = this.state;
        return (
        <Fragment>
            <div style={{overflow:"hidden",width:"100%",height:"100%"}} ref={this.domRef}>
            <div id="_search" style={{overflow:"auto",width:"100%",height:"100%"}}>
            <InfiniteScroll
                    dataLength={results.length}
                    next={this.onNextLoading}
                    hasMore={results.length < total}
                    loader={<Spin />}
                    // endMessage={<Divider/>}
                    scrollableTarget="_search"
                >
                {this.bodyRender()}
                </InfiniteScroll>
            </div>
            </div>
        </Fragment>
        );
    }
}
export default SearchView;