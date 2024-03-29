import React,{DSComponent,Fragment,post} from 'comp/index';

import { Empty,Row,Col,Collapse, message} from 'antd';
import {} from '@ant-design/icons';
import './index.less';

import  CaseTaskView from 'views/platform/share/case/manager/process/task';


class CaseProcessView extends DSComponent {
    constructor(props){
        super(props);
        this.state = {dataSource:[],activeKey:null};
        this.caseProcessFormRef = React.createRef();
    }
    static defaultProps = {
        lawCase:{}
    }
    componentDidMount = async() => {
        await this.reload();
    }
    reload = async()=>{
        const {lawCase} = this.props;
        const _params = new FormData();
        _params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseProcess/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.dataSource = (results===null||results===undefined)?[]:results;
                return state;
            });
        }
    }
    onExpandProcess=(e)=>{
        this.setState(state=>{
            state.activeKey = e;
            return state;
        });
    }
    render() {
        const {dataSource,activeKey} = this.state;
        const {lawCase} = this.props;
        return (
            <Fragment>
            <div className='fl-case-detail-base' id='CASE_PROCESS'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">工作流程</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                {dataSource.length>0&&
                <Collapse onChange={this.onExpandProcess} destroyInactivePanel={true} activeKey={activeKey}>
                    {dataSource.map(e=>{
                        return (
                        <Collapse.Panel header={e.title} key={e.id}>
                            <div>
                            <CaseTaskView lawCaseProcess={e} lawCase={lawCase} key={Math.floor(Math.random() * 10000)}/>
                            </div>
                        </Collapse.Panel>)
                    })}
                </Collapse>
                }
                {dataSource.length<=0&&<Empty description={"暂无数据"}/>}
                </div>
            </div>
            </Fragment>
        );
    }
}
export default CaseProcessView;