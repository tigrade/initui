import React,{DSComponent,Fragment,post} from 'comp/index';

import { Divider,Space,List, Empty,Button, message,Radio} from 'antd';
import {DeleteOutlined,EditOutlined} from '@ant-design/icons';
import './index.less';

import CaseTaskFormView from 'views/platform/case/manager/process/taskForm';

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
    onEditor=(e)=>{
        this.caseTaskFormRef.current.onEditor(e);
    }
    onDelete=async(e)=>{
        const params = new FormData();
        params.append("id", e.id);
        const response = await post("/api/lawCaseTask/delete",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.reload();
        }
    }
    onFormTypeChange=async(e)=>{
        // const value = e.target.value;
    }
    render() {
        const {dataSource} = this.state;
        const {lawCase} = this.props;
        return (
            <Fragment>
            <CaseTaskFormView onReloadList={this.reload} lawCase={lawCase}  ref={this.caseTaskFormRef}/>
            {dataSource.length>0&&
            <List itemLayout="vertical">
                {dataSource.map(e=>{
                    return (
                    <List.Item key={e.id} actions={[
                        <Radio.Group value={e.status}>
                            <Radio value={"PANDING"}>待处理</Radio>
                            <Radio value={"HANDLE"}>处理中</Radio>
                            <Radio value={"FINISH"}>已完成</Radio>
                        </Radio.Group>
                        ]}
                        extra={
                        <Space split={<Divider type="vertical" />}>
                            <Button type="link" icon={<EditOutlined />} onClick={this.onEditor.bind(this,e)}>编辑</Button>
                            <Button type="link" icon={<DeleteOutlined />} onClick={this.onDelete.bind(this,e)}>移除</Button>
                        </Space>
                        }>
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