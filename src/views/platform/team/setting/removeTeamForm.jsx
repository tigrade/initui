import React,{DSBase,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Select,Modal,message} from 'antd';

class TeamRemoveFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,dialogTitle:"移交团队设置"};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    onEditor=(teamId)=>{
        this.setState(state=>{
            state.dialog = true;
            state.teamId = teamId;
            return state;
        },()=>{
            this.loadTeamUserList(teamId);
        });
    }
    loadTeamUserList = async(teamId)=>{
        const params = new FormData();
        params.append("teamId", teamId);
        const response = await post('/api/team/user/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.teamUserList = results;
                return state;
            },()=>{
                
            });
        }
    }
    
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        });
    }

    onSaveOrUpdate=async(e)=>{
        const {teamMemberId} = e;
        const {teamId} = this.state;
        const params = new FormData();
        params.append("teamId", teamId);
        params.append("teamMemberId", teamMemberId);
        const response = await post("/api/team/change",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            //重定向到根目录
            window.location.href = DSBase.root.path;
        }
    }

    render(){
        const {dialog,dialogTitle,teamUserList} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="teamMemberId" label="团队成员" rules={[{ required: true, message: '团队成员不能为空' }]}>
                    <Select>
                        {teamUserList&&teamUserList.filter(e=>{
                            return e.merchantRoleCode==="TEAM_OWNER"?false:true;
                        }).map(e=>{
                            return <Select.Option value={e.id} key={e.id}>{e.alias}</Select.Option>
                        })}
                    </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default TeamRemoveFormView;