import React,{DSTable,DSComponent,Fragment} from 'comp/index';
import './index.less'
import {Row, Col,Button,Space} from 'antd';
import TeamView from 'views/platform/default/team'

class DefaultView extends DSComponent{   
    constructor(props){
        super(props);
        this.tableRef = React.createRef();
        this.teamRef = React.createRef();
        this.state = {searchCondition:props.searchCondition};
    }
    static defaultProps = {
        searchCondition:{}
    }
    componentDidMount=async ()=>{
        const {teamView} = this.props.context;
        console.log(teamView);
    }
    onLoadTeam = async()=>{
        
    }
    onEditor=(type)=>{
        if(type==="team"){
            this.teamRef.current.onEditor();
        }
    }
    render(){
        // const {teamId} = this.props.location.state|{teamId:undefined};
        const {searchCondition} = this.state;
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '承办人',dataIndex: 'code'},
        {title: '进度',dataIndex: 'code'},
        {title: '任务',dataIndex: 'level'},
        {title: '建档',dataIndex: 'code'},
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

            <div className='fl-case'>
                    <div className='fl-case-title'>
                    <Row wrap={false}>
                        <Col flex="auto">全部案件</Col>
                        <Col flex="100px" style={{textAlign:'right'}}>
                            {/* <Button type="primary" icon={<PlusOutlined/>} onClick={this.onEditor.bind(this,undefined)}>新增</Button> */}
                        </Col>
                    </Row>
                    </div>
                    <div className='ds-table-wrap'>
                        <DSTable columns={columns} searchCondition={searchCondition} path={'/api/case/find'} ref={this.tableRef}></DSTable>
                    </div>
                </div>
            
        </Fragment>
        );
    }
}
export default DefaultView;