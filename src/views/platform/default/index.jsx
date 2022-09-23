import React,{DSComponent,Fragment} from 'comp/index';
import './index.less'
import {Row, Col,Space, Card} from 'antd';

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
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }

    getMasterLawer=()=>{
        return {
            title: {
              text: '月份案件统计',
              subtext: '根据建立档案时间来统计案件',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'horizontal',
              bottom: '0'
            },
            dataset: {
                dimensions: ['product', '诉讼案件', '仲裁案件', '非诉案件','其他'],
                source: [
                { product: '2019', "诉讼案件": 50, "仲裁案件": 39, "非诉案件": 4,'其他':0 },
                { product: '2020', "诉讼案件": 43, "仲裁案件": 80, "非诉案件": 4,'其他':0 },
                { product: '2021', "诉讼案件": 5, "仲裁案件": 5, "非诉案件": 123,'其他':5 },
                { product: '2022', "诉讼案件": 60, "仲裁案件": 33, "非诉案件": 44,'其他':0 }
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' },{ type: 'bar' }]
        };
    }
    getProcessingTotal=()=>{
        return {
            title: {
              text: '主办案件统计',
              subtext: '正在处理中的案件',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '案件汇总',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: '吴律师' },
                  { value: 735, name: '洪律师' },
                  { value: 580, name: '黄律师' },
                  { value: 484, name: '蔡律师' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
    }

    getSourceTotal=()=>{
        return {
            title: {
              text: '案源统计',
              subtext: '根据建档时间来统计有效案件',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '案源人员',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 303, name: '吴总' },
                  { value: 13, name: '洪总' },
                  { value: 23, name: '黄总' },
                  { value: 484, name: '蔡总' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
    }

    getSourceTypeTotal=()=>{
        return {
            title: {
              text: '案件分类统计',
              subtext: '正在处理中的案件',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '案件类型',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 303, name: '诉讼案件' },
                  { value: 131, name: '仲裁案件' },
                  { value: 223, name: '非诉案件' },
                  { value: 44, name: '其他' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
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
            <Row wrap={false} style={{marginTop:"30px"}}>
                <Col span={12} style={{paddingRight:"8px"}}>
                    <Card>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
                <Col span={12} style={{paddingLeft:"8px"}}>
                    <Card>
                    <ReactECharts option={this.getSourceTypeTotal()}/>
                    </Card>
                </Col>
            </Row>

            <Row wrap={false} style={{marginTop:"30px"}}>
                <Col span={12} style={{paddingRight:"8px"}}>
                    <Card>
                    <ReactECharts option={this.getSourceTotal()}/>
                    </Card>
                </Col>
                <Col span={12} style={{paddingLeft:"8px"}}>
                    <Card>
                    <ReactECharts option={this.getProcessingTotal()}/>
                    </Card>
                </Col>
            </Row>
        </Fragment>
        );
    }
}
export default DefaultView;