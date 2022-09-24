import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'
import {Row, Col, Card,message} from 'antd';

import ReactECharts from 'echarts-for-react';

class DefaultView extends DSComponent{   
    constructor(props){
        super(props);
        const {teamView} = this.props.context;
        this.state = {teamView:teamView,lawCaseSource:[],lawCaseMaster:[],castTypeSource:[],monthSource:[]};
    }
    static defaultProps = {
    }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    componentDidMount = async() => {
      await this.onLawCaseSource();
      await this.onLawCaseMaster();
      await this.onCaseTypeSource();
      await this.onMonthSource();
    }
    onLawCaseSource=async()=>{
      const {teamView} = this.state;
      const params = new FormData();
      params.append('teamId', teamView.id);
      const response = await post('/api/statistics/lawCase/source',params).catch(error => {
          message.error(error.message);
      });
      if(response){
        const {results} = response;
        this.setState(state=>{
          state.lawCaseSource = results;
          return state;
        });
      }
    }

    onLawCaseMaster=async()=>{
      const {teamView} = this.state;
      const params = new FormData();
      params.append('teamId', teamView.id);
      const response = await post('/api/statistics/lawCase/master',params).catch(error => {
          message.error(error.message);
      });
      if(response){
        const {results} = response;
        this.setState(state=>{
          state.lawCaseMaster = results;
          return state;
        });
      }
    }

    onCaseTypeSource=async()=>{
      const {teamView} = this.state;
      const params = new FormData();
      params.append('teamId', teamView.id);
      const response = await post('/api/statistics/lawCase/caseType',params).catch(error => {
          message.error(error.message);
      });
      if(response){
        const {results} = response;
        this.setState(state=>{
          state.castTypeSource = results;
          return state;
        });
      }
    }

    onMonthSource=async()=>{
      const {teamView} = this.state;
      const params = new FormData();
      params.append('teamId', teamView.id);
      const response = await post('/api/statistics/lawCase/month',params).catch(error => {
          message.error(error.message);
      });
      if(response){
        const {results} = response;
        this.setState(state=>{
          state.monthSource = results;
          return state;
        });
      }
    }

    getMasterLawer=()=>{
      const {monthSource} = this.state;
      return {
          title: {text: '月份案件统计',subtext: '根据建立档案时间来统计案件',left: 'center'},
          tooltip: {trigger: 'item',axisPointer: {animation: true},formatter: function (params) {
            const {marker,seriesName,name,value} = params;
            const q = value[seriesName]+"".concat("件");
            return seriesName+"</br>"+"<p style='margin:6px 0px 0px 0px'>"+marker+name.substring(4).concat("月")+"<span style='padding-left:60px '>"+"</span>"+q+"</p>";
            }   
          },
          legend: {orient: 'horizontal',bottom: '0'},
          dataset: {
              dimensions: ['time', '诉讼案件', '仲裁案件', '非诉案件','顾问服务','其他'],
              source: monthSource
          },
          xAxis: { type: 'category', axisLabel:{formatter:function(v){return v.substring(4).concat("月份")}}},
          yAxis: {},
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' },{ type: 'bar' },{ type: 'bar' }]
      };
    }

    getProcessingTotal=()=>{
      const {lawCaseMaster} = this.state;
      const dataSet = lawCaseMaster.map(e=>{
        return {value:e.count,name:e.name};
      });
      return {
          title: {text: '主办案件统计',subtext: '正在处理中的案件',left: 'center'},
          tooltip: {trigger: 'item'},
          legend: {orient: 'vertical',left: 'left'},
          series: [{
              name: '案件汇总',
              type: 'pie',
              radius: '50%',
              data: dataSet,
              emphasis: {itemStyle: {shadowBlur: 10,shadowOffsetX: 0,shadowColor: 'rgba(0, 0, 0, 0.5)'}}
          }]
      };
    }

    getSourceTotal=()=>{
      const {lawCaseSource} = this.state;
      const dataSet = lawCaseSource.map(e=>{
        return {value:e.count,name:e.name};
      });
      return {
          title: {text: '案源统计',subtext: '根据建档时间来统计有效案件',left: 'center'},
          tooltip: {trigger: 'item'},
          legend: {orient: 'vertical',left: 'left'},
          series: [
            {
              name: '案源人员',
              type: 'pie',
              radius: '50%',
              data: dataSet,
              emphasis: {itemStyle: {shadowBlur: 10,shadowOffsetX: 0,shadowColor: 'rgba(0, 0, 0, 0.5)'}}
            }
          ]
        };
    }

    getSourceTypeTotal=()=>{
      const {castTypeSource} = this.state;
      const dataSet = castTypeSource.map(e=>{
        return {value:e.count,name:e.name};
      });
      
      return {
          title: {text: '案件分类统计',subtext: '正在处理中的案件',left: 'center'},
          tooltip: {trigger: 'item'},
          legend: {orient: 'vertical',left: 'left'},
          series: [{
              name: '案件类型',
              type: 'pie',
              radius: '50%',
              data: dataSet,
              emphasis: {itemStyle: {shadowBlur: 10,shadowOffsetX: 0,shadowColor: 'rgba(0, 0, 0, 0.5)'}}
          }]
      };
    }

    render(){
        const {teamView} = this.state;
        if(teamView===undefined||(teamView!==undefined&&teamView.id===undefined)){
            return;
        }
        return (
        <Fragment>
            <Row gutter={[32,32]} style={{padding:34}}>
                <Col span={12} >
                    <Card>
                    <ReactECharts option={this.getMasterLawer()}/>
                    </Card>
                </Col>
                <Col span={12} >
                    <Card>
                    <ReactECharts option={this.getSourceTypeTotal()}/>
                    </Card>
                </Col>
                <Col span={12} >
                    <Card>
                    <ReactECharts option={this.getSourceTotal()}/>
                    </Card>
                </Col>
                <Col span={12} >
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