import React,{DSComponent,Fragment,post} from 'comp/index';

import './index.less'
import { List,Row, Col,Button,Switch,message } from 'antd';
import TeamSettingFormView from 'views/platform/team/setting/form';
import TeamRobotFormView from 'views/platform/team/setting/robotForm';

class TeamSettingView extends DSComponent{   
    constructor(props){
        super(props);
        const {teamView} = this.props.context;
        this.formRef = React.createRef();
        this.robotFormRef = React.createRef();
        this.state = {teamView:teamView,team:{}};
    }
    static defaultProps = {
    }
    static getDerivedStateFromProps(props,state){
        if(props.context.teamView !== state.teamView) {
            return {teamView:props.context.teamView}
        }
        return null;
    }
    
    componentDidMount=async ()=>{
        await this.reload();
    }
    reload=async()=>{
        const _teamView_ = sessionStorage.getItem('teamView');
        const teamView= JSON.parse(_teamView_);
        const params = new FormData();
        params.append('id', teamView.id);
        const response = await post('/api/team/find/one',params).catch(error => {
            message.error(error.message);
        });
        const robotBind = await this.onBindRobot(teamView.id);
        const hasRobotBind = robotBind===null?false:true

        if(response){
            const {results} = response;
            this.setState(state=>{
                state.team = results;
                state.robotBind= robotBind;
                state.hasRobotBind = hasRobotBind;
                return state;
            });
        }

    }
    onBindRobot=async(teamId)=>{
        const params = new FormData();
        params.append('teamId', teamId);
        const response = await post('/api/dingTalkSetting/info',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            return results;
        }
    }
    onEdit=()=>{
        const {team} = this.state;
        this.formRef.current.onEditor(team);
    }
    onTransfer=()=>{

    }
    onAutoAuthorize=async(e)=>{
        const {teamView} = this.state;
        const params = new FormData();
        params.append('id', teamView.id);
        params.append('type', e);
        const response = await post('/api/team/autoAuthorize',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.reload();
        }
    }
    onDissolve=async()=>{
        const {teamView} = this.state;
        const params = new FormData();
        params.append('id', teamView.id);
        const response = await post('/api/team/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            sessionStorage.removeItem('isTeam');
            window.location.reload();
        }
    }
    onQuite=()=>{
        
    }
    onRobot=async()=>{
        const {hasRobotBind,teamView} = this.state;
        const teamId = teamView.id;
        if(hasRobotBind===false){
            this.robotFormRef.current.onEditor(teamId);
        }else{
            const params = new FormData();
            params.append('teamId', teamId);
            const response = await post('/api/dingTalkSetting/delete',params).catch(error => {
                message.error(error.message);
            });
            if(response){
                // const {results} = response;
                message.success(response.message);
                this.reload();
            }
        }
    }
    render(){
        const {teamView,team,hasRobotBind} = this.state;
        const {owner} = team;
        if(!teamView)return;
        if(!owner)return;
        console.log(hasRobotBind);
        let data = [
            {title: '团队名称',desc: teamView.name},
            {title: '退出团队',desc: '退出团队后，所有内容都将无法访问',action:[<Button type="primary" shape="round" onClick={this.onQuite}>退出</Button>]},
          ];
        if(owner===true){
            data = [
            {title: '团队名称',desc: teamView.name,action:[<Button type="primary" shape="round" onClick={this.onEdit}>编辑</Button>]},
            {title: '加入团队需要管理员审核',desc: '',action:[<Switch checked={team.autoAuthorize} onChange={this.onAutoAuthorize}/>]},
            {title: `钉钉群机器人【${hasRobotBind===true?"已設置":"未設置"}】`,desc: '每个团队只能绑定一个钉钉的群机器人发送消息',action:[<Button type="primary" shape="round" onClick={this.onRobot}>{hasRobotBind===true?"解綁":"绑定"}</Button>]},
            {title: '移交团队', desc: '每个团队只有一位所有者，移交后你将变为管理员员哦',action:[<Button type="primary" shape="round" onClick={this.onTransfer}>移交</Button>]},
            {title: '解散团队',desc: '解散团队后，所有内容都会被立即删除，不可恢复哦',action:[<Button type="primary" shape="round" onClick={this.onDissolve}>解散</Button>]},
            ];
        }
        return (
        <Fragment>
            <TeamSettingFormView ref={this.formRef} reloadTable={this.reload}/>
            <TeamRobotFormView ref={this.robotFormRef} reloadTable={this.reload} key={Math.floor(Math.random() * 10000)}/>
            <div className='fl-team-setting'>
                <div className='fl-team-setting-title'>
                <Row wrap={false}>
                    <Col flex="auto">团队设置</Col>
                </Row>
                </div>
                <div className='fl-team-setting-wrap'>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                    <List.Item actions={item.action}>
                        <List.Item.Meta title={item.title} description={item.desc} />
                    </List.Item>
                    )}
                />
                </div>
            </div>
        </Fragment>
        );
    }
}
export default TeamSettingView;