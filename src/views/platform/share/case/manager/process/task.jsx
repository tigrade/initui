import React,{DSComponent,Fragment,post} from 'comp/index';

import { Divider,Space,List, Empty, message} from 'antd';
import './index.less';
class CaseTaskView extends DSComponent {
    constructor(props){
        super(props);
        this.state = {dataSource:[]};
        this.caseTaskFormRef = React.createRef();
    }
    static defaultProps = {
        lawCaseProcess:{}
    }
    componentDidMount = async() => {
       await this.reload();
    }
    reload= async ()=>{
        const {lawCaseProcess} = this.props;
        const _params = new FormData();
        _params.append('lawCaseProcessId', lawCaseProcess.id);
        const response = await post('/api/lawCaseTask/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.dataSource = results===null||results===undefined?[]:results;
                return state;
            });
        }
    }
    render() {
        const {dataSource} = this.state;
        const {lawCase} = this.props;
        return (
            <Fragment>
            {dataSource.length>0&&
            <List itemLayout="vertical">
                {dataSource.map(e=>{
                    return (
                    <List.Item key={e.id}>
                        <List.Item.Meta title={e.title} description={<Space split={<Divider type="vertical" />} style={{fontSize:12}}>
                            {e.executeUserAlias!==null&&<span>执行人:{e.executeUserAlias}</span>}
                            {e.status!==null&&<span>状态:{e.status==="PANDING"?"待处理":e.status==="HANDLE"?"处理中":e.status==="FINISH"?"已完成":""}</span>}
                        </Space>}/>
                        {e.content}
                    </List.Item>
                    )
                })}
                
            </List>
            }
            {dataSource.length<=0&&<Empty description={"暂无数据"}/>}
            </Fragment>
        );
    }
}
export default CaseTaskView;