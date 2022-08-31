import React,{DSTable,DSComponent,Fragment} from 'comp/index';
import './index.less'
import {Row, Col,Button,Space, Card} from 'antd';
import TeamView from 'views/platform/default/team';
import ReactECharts from 'echarts-for-react';

class DefaultView extends DSComponent{   
    constructor(props){
        super(props);
        this.tableRef = React.createRef();
        this.teamRef = React.createRef();
        const {teamView} = this.props.context;
        this.state = {searchCondition:props.searchCondition,teamView:teamView};
    }
    static defaultProps = {
        searchCondition:{}
    }
    // componentDidMount=async ()=>{
    //     const {teamView} = this.props.context;
    //     console.log(teamView);
    // }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    onLoadTeam = async()=>{
        
    }
    onEditor=(type)=>{
        if(type==="team"){
            this.teamRef.current.onEditor();
        }
    }

    getMasterLawer=()=>{
        return {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '诉讼案件', '仲裁案件', '非诉案件','其他'],
                source: [
                { product: '吴律师', "诉讼案件": 50, "仲裁案件": 39, "非诉案件": 4,'其他':0 },
                { product: '黄律师', "诉讼案件": 43, "仲裁案件": 80, "非诉案件": 4,'其他':0 },
                { product: '懂律师', "诉讼案件": 5, "仲裁案件": 5, "非诉案件": 123,'其他':5 },
                { product: '林律师', "诉讼案件": 60, "仲裁案件": 33, "非诉案件": 44,'其他':0 }
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' },{ type: 'bar' }]
        };
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
        }},
        {title: '程序',dataIndex: 'code'},
        {title: '主办律师',dataIndex: 'code'},
        {title: '进度',dataIndex: 'code'},
        {title: '任务',dataIndex: 'level'},
        {title: '建档',dataIndex: 'createTime'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
            </Space>
            );
        }}];

        return (
        <Fragment>
            <TeamView ref={this.teamRef} {...{navigate:this.props.navigate}}/>
            <div className='fl-quick'>
                <div className='fl-quick-title'>
                <Row wrap={false}>
                    <Col flex="auto">快捷菜单</Col>
                </Row>
                </div>
                <div className='fl-quick-button'>
                <Space size="large">
                    <Button type="primary" size="large" onClick={this.onEditor.bind(this,'case')}>新增案件</Button>
                    <Button size="large" onClick={this.onEditor.bind(this,'team')}>切换 / 创建团队</Button>
                </Space>
                </div>
            </div>
            
            <Row wrap={false} style={{marginTop:"12px"}}>
                <Col span={12} style={{paddingRight:"8px"}}>
                    <Card title={"案件总量分布【年度】"}>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
                <Col span={12} style={{paddingLeft:"8px"}}>
                    <Card title={"案件类型分布【当日】"}>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
            </Row>

            <Row wrap={false} style={{marginTop:"12px"}}>
                <Col span={12} style={{paddingRight:"8px"}}>
                    <Card title={"【诉讼案件】案件状态分布"}>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
                <Col span={12} style={{paddingLeft:"8px"}}>
                    <Card title={"【诉讼案件】律师案件分布"}>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
            </Row>

            {/* <div className='fl-case'>
                <div className='fl-case-title'>
                <Row wrap={false}>
                    <Col flex="auto">全部案件</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                    </Col>
                </Row>
                </div>
                <div className='ds-table-wrap'>
                    <DSTable columns={columns} searchCondition={condition} path={'/api/lawCase/find'} ref={this.tableRef}></DSTable>
                </div>
            </div> */}
            
        </Fragment>
        );
    }
}
export default DefaultView;